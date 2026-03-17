import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
