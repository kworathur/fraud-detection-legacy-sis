import { NextResponse } from 'next/server';

function buildCognitoBaseUrl(): string {
    const domain = process.env.COGNITO_DOMAIN;
    if (!domain) {
        throw new Error('COGNITO_DOMAIN is not configured');
    }

    if (domain.startsWith('http://') || domain.startsWith('https://')) {
        return domain.replace(/\/+$/, '');
    }

    return `https://${domain.replace(/\/+$/, '')}`;
}

export async function GET() {
    const clientId = process.env.COGNITO_CLIENT_ID;
    if (!clientId) {
        return NextResponse.json(
            { error: 'COGNITO_CLIENT_ID is not configured' },
            { status: 500 }
        );
    }

    const baseUrl = buildCognitoBaseUrl();
    const logoutUrl = new URL('/logout', baseUrl);
    const logoutUri =
        process.env.COGNITO_LOGOUT_URI ?? 'http://localhost:3000/login';

    logoutUrl.searchParams.set('client_id', clientId);
    logoutUrl.searchParams.set('logout_uri', logoutUri);

    return NextResponse.redirect(logoutUrl);
}
