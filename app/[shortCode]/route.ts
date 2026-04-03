import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { shortCode: string } },
) {
  try {
    const { shortCode } = await params;
    if (!shortCode) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 1. Find URL in DB
    const record = await prisma.urlShortener.findUnique({
      where: { shortUrl: shortCode },
    });

    // 2. If not found → 404 page or homepage
    if (!record) {
      return NextResponse.redirect(new URL("/404", req.url));
    }
    await prisma.urlShortener.update({
      where: { shortUrl: shortCode },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
    // 3. Redirect to original URL
    return NextResponse.redirect(record.original, 307);
  } catch (error) {
    console.error("Redirect error:", error);

    return NextResponse.redirect(new URL("/", req.url));
  }
}
