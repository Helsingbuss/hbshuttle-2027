import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const portalBaseUrl =
    process.env.NEXT_PUBLIC_PORTAL_API_URL || "https://login.helsingbuss.se";

  const search = request.nextUrl.searchParams.toString();

  const url = `${portalBaseUrl.replace(/\/$/, "")}/api/public/shuttle/departures${
    search ? `?${search}` : ""
  }`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Could not load shuttle departures",
      },
      { status: 500 }
    );
  }
}
