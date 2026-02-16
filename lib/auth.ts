import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION ?? "us-east-1",
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Cognito",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!username || !password) {
          return null;
        }

        try {
          const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthParameters: {
              USERNAME: username,
              PASSWORD: password,
            },
          });

          const response = await cognitoClient.send(command);

          if (!response.AuthenticationResult) {
            // This can happen when Cognito returns a challenge (MFA, new password required, etc.)
            // For now, we don't handle challenges — extend here as needed.
            return null;
          }

          const { IdToken, AccessToken, RefreshToken } =
            response.AuthenticationResult;

          // Decode the ID token to extract user claims (sub, email, name, etc.)
          const payload = IdToken
            ? JSON.parse(
                Buffer.from(IdToken.split(".")[1], "base64url").toString()
              )
            : {};

          return {
            id: payload.sub ?? username,
            name: payload.name ?? payload["cognito:username"] ?? username,
            email: payload.email ?? null,
            idToken: IdToken,
            accessToken: AccessToken,
            refreshToken: RefreshToken,
          };
        } catch (error) {
          console.error("Cognito authentication failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, persist Cognito tokens in the JWT
      if (user) {
        token.idToken = (user as Record<string, unknown>).idToken;
        token.accessToken = (user as Record<string, unknown>).accessToken;
        token.refreshToken = (user as Record<string, unknown>).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose token data to the client session if needed
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
