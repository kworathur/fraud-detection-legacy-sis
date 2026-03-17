import NextAuth from 'next-auth';
import Cognito from 'next-auth/providers/cognito';

const DEFAULT_COGNITO_SCOPE =
    'com.apigw/advising.admin openid profile com.apigw/advising.student email';

type CognitoJwtPayload = {
    sub?: string;
    name?: string;
    email?: string;
    'cognito:username'?: string;
    'cognito:groups'?: string[];
};

function decodeJwtPayload(token?: string | null): CognitoJwtPayload {
    if (!token) {
        return {};
    }
    try {
        return JSON.parse(
            Buffer.from(token.split('.')[1], 'base64url').toString()
        ) as CognitoJwtPayload;
    } catch (error) {
        console.warn('[auth] Failed to decode token payload', error);
        return {};
    }
}

function resolveCognitoDomain(): string {
    const domain = process.env.COGNITO_DOMAIN;
    if (!domain) {
        throw new Error('COGNITO_DOMAIN is not configured');
    }
    if (domain.startsWith('http://') || domain.startsWith('https://')) {
        return domain.replace(/\/+$/, '');
    }
    return `https://${domain.replace(/\/+$/, '')}`;
}

function resolveCognitoIssuer(): string {
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    if (!userPoolId) {
        throw new Error('COGNITO_USER_POOL_ID is not configured');
    }
    const region =
        process.env.COGNITO_AWS_REGION ??
        userPoolId.split('_')[0] ??
        'us-east-1';
    return `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
}

export async function refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    idToken: string;
    expiresAt: number;
} | null> {
    try {
        const tokenUrl = `${resolveCognitoDomain()}/oauth2/token`;
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env.COGNITO_CLIENT_ID ?? '',
            refresh_token: refreshToken,
        });

        if (process.env.COGNITO_CLIENT_SECRET) {
            params.set('client_secret', process.env.COGNITO_CLIENT_SECRET);
        }

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });

        if (!response.ok) {
            console.error(
                '[auth] Failed to refresh token',
                response.status,
                await response.text()
            );
            return null;
        }

        const data = (await response.json()) as {
            access_token: string;
            id_token: string;
            expires_in: number;
        };

        return {
            accessToken: data.access_token,
            idToken: data.id_token,
            expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
        };
    } catch (error) {
        console.error('[auth] Token refresh error', error);
        return null;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    providers: [
        Cognito({
            clientId: process.env.COGNITO_CLIENT_ID ?? '',
            ...(process.env.COGNITO_CLIENT_SECRET
                ? { clientSecret: process.env.COGNITO_CLIENT_SECRET }
                : {}),
            issuer: resolveCognitoIssuer(),
            authorization: {
                url: `${resolveCognitoDomain()}/oauth2/authorize`,
                params: {
                    scope: process.env.COGNITO_SCOPE ?? DEFAULT_COGNITO_SCOPE,
                },
            },
            token: `${resolveCognitoDomain()}/oauth2/token`,
            userinfo: `${resolveCognitoDomain()}/oauth2/userInfo`,
            checks: ['pkce', 'state'],
            client: {
                token_endpoint_auth_method: process.env.COGNITO_CLIENT_SECRET
                    ? 'client_secret_post'
                    : 'none',
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.idToken = account.id_token;
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.scope = account.scope;

                const payload = decodeJwtPayload(account.id_token);
                token.groups = Array.isArray(payload['cognito:groups'])
                    ? payload['cognito:groups']
                    : [];
            }

            if (profile?.sub) {
                token.sub = profile.sub;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            (session as { accessToken?: unknown }).accessToken =
                token.accessToken;
            (session as { refreshToken?: unknown }).refreshToken =
                token.refreshToken;
            session.user.groups = Array.isArray(token.groups)
                ? (token.groups as string[])
                : [];
            session.user.isAdmin =
                session.user.groups.includes('advising-admin');
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
});
