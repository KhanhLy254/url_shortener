import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encodeBase62 } from "@/lib/base62";
import { Prisma } from "@prisma/client";

function normalizeUrl(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  const parsed = new URL(url);
  return parsed.toString().replace(/\/$/, "");
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { url } = body;

    // 1. Validate input
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // 2. Normalize URL
    url = normalizeUrl(url);

    // 3. Validate URL
    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }
    const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

    const existing = await prisma.urlShortener.findFirst({
      where: { original: url },
    });

    if (existing) {
      return NextResponse.json({
        shortUrl: `${baseUrl}/${existing.shortUrl}`,
        code: existing.shortUrl,
        original: existing.original,
      });
    }

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const created = await tx.urlShortener.create({
          data: {
            original: url,
            shortUrl: crypto.randomUUID(), 
          },
        });

        const code = encodeBase62(Number(created.id));

        const updated = await tx.urlShortener.update({
          where: { id: created.id },
          data: { shortUrl: code },
        });

        return updated;
      },
    );

    // 6. Response
    return NextResponse.json(
      {
        shortUrl: `${baseUrl}/${result.shortUrl}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error shortening URL:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
