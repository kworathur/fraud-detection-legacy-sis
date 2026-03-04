import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const baseUrl = process.env.QUAID_API_BASE_URL;

function buildUpstreamUrl(req: NextRequest, path: string[]) {

  const target = new URL(path.join("/"), baseUrl);
  req.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.append(key, value);
  });
  return target;
}

async function forward(req: NextRequest, path: string[]) {
  if (!baseUrl) {
    return NextResponse.json(
      { error: "QUAID_API_BASE_URL is not configured" },
      { status: 500 },
    );
  }

  const session = await auth();
  const accessToken = (session as { accessToken?: unknown } | null)?.accessToken;
  if (typeof accessToken !== "string" || !accessToken) {
    console.warn("[quaid-proxy] Missing access token", {
      method: req.method,
      path: `/${path.join("/")}`,
    });
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = buildUpstreamUrl(req, path);
  const method = req.method;
  const body = method === "GET" || method === "HEAD" ? undefined : await req.text();
  const startedAt = Date.now();

 

  const upstream = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(req.headers.get("content-type")
        ? { "Content-Type": req.headers.get("content-type") as string }
        : {}),
    },
    body,
    cache: "no-store",
  });

  console.info("[quaid-proxy] Upstream request", {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(req.headers.get("content-type")
        ? { "Content-Type": req.headers.get("content-type") as string }
        : {}),
    },
    body,
    upstreamUrl: url.toString(),
    hasBody: Boolean(body),
  });

  const responseBody = await upstream.text();
  console.info("[quaid-proxy] Upstream response", {
    method,
    upstreamUrl: url.toString(),
    status: upstream.status,
    durationMs: Date.now() - startedAt,
  });
  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
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
