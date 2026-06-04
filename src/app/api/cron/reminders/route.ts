import { processPendingReminders } from "@/services/reminder.service";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

// GET /api/cron/reminders
//
// Processes pending reminders automatically.
//
// Local dev:  Call manually or use setInterval/node-cron.
// Production: Configure as a Vercel Cron Job in vercel.json:
//   { "crons": [{ "path": "/api/cron/reminders", "schedule": "*/5 * * * *" }] }
//
// Security: Protected by CRON_SECRET in production.
export async function GET(req: Request) {
  // In production, verify the cron secret to prevent unauthorized access
  const cronSecret = process.env.CRON_SECRET;
  if (process.env.NODE_ENV === "production" && !cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (cronSecret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await processPendingReminders();

    logger.info("cron reminders processed", {
      processed: result.processed,
      sent: result.sent,
      failed: result.failed,
    });

    return NextResponse.json({
      ok: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.error("cron reminders error", { err });
    return NextResponse.json(
      { error: "Hatırlatma işleme hatası" },
      { status: 500 }
    );
  }
}
