import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const portalBaseUrl =
    process.env.NEXT_PUBLIC_PORTAL_API_URL || "https://login.helsingbuss.se";

  const search = request.nextUrl.searchParams.toString();

  const url = `${portalBaseUrl.replace(/\/$/, "")}/api/public/shuttle/traffic-messages${
    search ? `?${search}` : ""
  }`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    const contentType = response.headers.get("Content-Type") || "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        {
          ok: true,
          count: 0,
          messages: [],
          warning: "Traffic messages API is not available yet.",
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: true,
        count: 0,
        messages: [],
        warning: error?.message || "Could not load traffic messages",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
