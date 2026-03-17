import { NextRequest, NextResponse } from "next/server";
import { auth, refreshAccessToken } from "@/lib/auth";

const baseUrl = process.env.QUAID_API_BASE_URL;

function buildUpstreamUrl(req: NextRequest, path: string[]) {
  const target = new URL(path.join("/"), baseUrl);
  req.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.append(key, value);
  });
  return target;
}

function buildHeaders(
  accessToken: string,
  contentType: string | null,
): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`,
    ...(contentType ? { "Content-Type": contentType } : {}),
  };
}

async function forward(req: NextRequest, path: string[]) {
  if (!baseUrl) {
    return NextResponse.json(
      { error: "QUAID_API_BASE_URL is not configured" },
      { status: 500 },
    );
  }

  const session = await auth();
  const accessToken = (session as { accessToken?: unknown } | null)
    ?.accessToken;
  if (typeof accessToken !== "string" || !accessToken) {
    console.warn("[quaid-proxy] Missing access token", {
      method: req.method,
      path: `/${path.join("/")}`,
    });
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = buildUpstreamUrl(req, path);
  const method = req.method;
  const body =
    method === "GET" || method === "HEAD" ? undefined : await req.text();
  const contentType = req.headers.get("content-type");
  const startedAt = Date.now();

  // First attempt with the current access token
  let upstream = await fetch(url, {
    method,
    headers: buildHeaders(accessToken, contentType),
    body,
    cache: "no-store",
  });

  console.info("[quaid-proxy] Upstream response", {
    method,
    upstreamUrl: url.toString(),
    status: upstream.status,
    durationMs: Date.now() - startedAt,
  });

  // If upstream returns 401, try refreshing the token and retrying once
  if (upstream.status === 401) {
    const refreshToken = (session as { refreshToken?: unknown } | null)
      ?.refreshToken;
    if (typeof refreshToken === "string" && refreshToken) {
      console.info("[quaid-proxy] Upstream 401 — refreshing access token...");
      const refreshed = await refreshAccessToken(refreshToken);

      if (refreshed) {
        upstream = await fetch(url, {
          method,
          headers: buildHeaders(refreshed.accessToken, contentType),
          body,
          cache: "no-store",
        });

        console.info("[quaid-proxy] Retry after refresh", {
          method,
          upstreamUrl: url.toString(),
          status: upstream.status,
          durationMs: Date.now() - startedAt,
        });

        if (upstream.status !== 401) {
          // Refresh succeeded — return the response
          const responseBody = await upstream.text();
          return new NextResponse(responseBody, {
            status: upstream.status,
            headers: {
              "content-type":
                upstream.headers.get("content-type") ?? "application/json",
            },
          });
        }
      }
    }

    // Refresh failed or no refresh token — session is truly expired
    return NextResponse.json(
      { error: "Session expired", code: "SESSION_TIMEOUT" },
      { status: 401 },
    );
  }

  const responseBody = await upstream.text();
  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forward(req, path);
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forward(req, path);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forward(req, path);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return forward(req, path);
}
