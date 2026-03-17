/**
 * Helpers for calling backend APIs directly during test setup/teardown.
 * Uses M2M (client_credentials) authentication for the testing endpoints.
 */

const API_BASE_URL = process.env.QUAID_API_BASE_URL;
const COGNITO_TOKEN_URL = process.env.COGNITO_TOKEN_URL;
const M2M_CLIENT_ID = process.env.E2E_M2M_CLIENT_ID;
const M2M_CLIENT_SECRET = process.env.E2E_M2M_CLIENT_SECRET;
const M2M_SCOPE = process.env.E2E_M2M_SCOPE ?? 'com.apigw/scope1';

interface ClientCredentialsResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

/**
 * Obtain an M2M access token using the OAuth2 client_credentials flow.
 */
export async function getM2MAccessToken(): Promise<string> {
    if (!COGNITO_TOKEN_URL) {
        throw new Error('COGNITO_TOKEN_URL env var is required');
    }
    if (!M2M_CLIENT_ID || !M2M_CLIENT_SECRET) {
        throw new Error(
            'E2E_M2M_CLIENT_ID and E2E_M2M_CLIENT_SECRET env vars are required'
        );
    }

    const credentials = Buffer.from(
        `${M2M_CLIENT_ID}:${M2M_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch(COGNITO_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`,
        },
        body: `grant_type=client_credentials&scope=${M2M_SCOPE}`,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`M2M token request failed: ${response.status} ${text}`);
    }

    const data = (await response.json()) as ClientCredentialsResponse;
    return data.access_token;
}

/**
 * Call the backend API with an access token.
 */
export async function apiRequest<T>(
    path: string,
    accessToken: string,
    init?: RequestInit
): Promise<T> {
    if (!API_BASE_URL) {
        throw new Error('QUAID_API_BASE_URL env var is required');
    }

    const url = new URL(path, API_BASE_URL);

    const response = await fetch(url, {
        ...init,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            ...(init?.headers ?? {}),
        },
    });

    const text = await response.text();
    const data = text ? (JSON.parse(text) as unknown) : null;

    if (!response.ok && response.status !== 207) {
        throw new Error(
            `API ${init?.method ?? 'GET'} ${path} failed: ${response.status} ${text}`
        );
    }

    return data as T;
}
