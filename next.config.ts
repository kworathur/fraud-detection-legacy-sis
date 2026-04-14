import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
    turbopack: {
        // We set the root to the directory where next.config.ts is located (__dirname)
        root: path.join(__dirname),
    },
    env: {
        COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
        COGNITO_AWS_REGION: process.env.COGNITO_AWS_REGION,
        COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
        COGNITO_DOMAIN: process.env.COGNITO_DOMAIN,
        COGNITO_SCOPE: process.env.COGNITO_SCOPE,
        COGNITO_TOKEN_URL: process.env.COGNITO_TOKEN_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        QUAID_API_BASE_URL: process.env.QUAID_API_BASE_URL,
    },
};
export default nextConfig;
