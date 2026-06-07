import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { consumeRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod";

const exportRequestSchema = z.object({
  organizationSlug: z.string().min(1),
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  reason: z.string().max(1000).optional(),
  format: z.enum(["json", "csv"]).default("json"),
});

export async function POST(req: Request) {
  try {
    // Rate limit: 3 export requests per 15 minutes per IP
    const ip = getClientIp(req.headers as Headers);
    const rateLimit = consumeRateLimit({
      key: `gdpr:export:${ip}`,
      limit: 3,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Çok fazla istek. Lütfen daha sonra tekrar deneyin." },
        { status: 429, headers: rateLimitHeaders(rateLimit) }
      );
    }

    const body = await req.json();
    const parsed = exportRequestSchema.parse(body);

    const org = await db.organization.findUnique({
      where: { slug: parsed.organizationSlug },
      select: { id: true },
    });
    if (!org) {
      return NextResponse.json({ error: "İşletme bulunamadı." }, { status: 404 });
    }

    const customer = await db.customer.findFirst({
      where: {
        organizationId: org.id,
        email: parsed.email,
      },
      select: { id: true },
    });

    const request = await db.dataExportRequest.create({
      data: {
        organizationId: org.id,
        customerId: customer?.id ?? null,
        email: parsed.email,
        reason: parsed.reason,
        format: parsed.format,
        status: "pending",
      },
      select: {
        id: true,
        status: true,
        format: true,
      },
    });

    return NextResponse.json({ data: request }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    logger.error("GDPR export request failed", { err });
    return NextResponse.json({ error: "İstek oluşturulamadı." }, { status: 500 });
  }
}
