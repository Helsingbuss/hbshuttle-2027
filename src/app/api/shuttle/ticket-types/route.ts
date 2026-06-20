import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const portalBaseUrl =
    process.env.NEXT_PUBLIC_PORTAL_API_URL || "https://login.helsingbuss.se";

  const url = `${portalBaseUrl.replace(/\/$/, "")}/api/public/shuttle/ticket-types`;

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
        message: error?.message || "Could not load ticket types",
      },
      { status: 500 }
    );
  }
}
