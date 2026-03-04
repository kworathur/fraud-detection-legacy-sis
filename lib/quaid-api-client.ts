export class QuaidApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "QuaidApiError";
    this.status = status;
  }
}

type ErrorPayload = {
  message?: string;
  error?: {
    message?: string;
    code?: string;
    details?: unknown;
  };
};

export async function quaidApiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api/quaid/${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.headers ?? {}),
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });

  const raw = await response.text();
  const data = raw ? (JSON.parse(raw) as unknown) : null;

  if (!response.ok) {
    const payload = (data ?? {}) as ErrorPayload;
    const message =
      payload?.error?.message ??
      payload?.message ??
      `Request failed with status ${response.status}`;

    throw new QuaidApiError(message, response.status);
  }

  return data as T;
}
