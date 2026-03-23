import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { webpush } from "@/lib/webpush";

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    // Find tasks with reminders due (not yet sent, reminder time <= now)
    const dueTasks = await prisma.task.findMany({
      where: {
        reminder: { lte: now },
        reminderSent: false,
        completed: false,
      },
    });

    if (dueTasks.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    // Get all push subscriptions
    const subscriptions = await prisma.pushSubscription.findMany();

    let sent = 0;
    for (const task of dueTasks) {
      const priorityEmoji =
        task.priority === "HIGH"
          ? "🔴"
          : task.priority === "MEDIUM"
            ? "🟡"
            : "🟢";

      const payload = JSON.stringify({
        title: `${priorityEmoji} ${task.title}`,
        body: task.time ? `Запланировано на ${task.time}` : "Напоминание",
        tag: task.id,
        url: "/",
      });

      // Send to all subscriptions
      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            payload
          );
          sent++;
        } catch (err: unknown) {
          const statusCode = (err as { statusCode?: number }).statusCode;
          // Remove expired subscriptions (410 Gone or 404)
          if (statusCode === 410 || statusCode === 404) {
            await prisma.pushSubscription.delete({
              where: { id: sub.id },
            });
          }
        }
      }

      // Mark reminder as sent
      await prisma.task.update({
        where: { id: task.id },
        data: { reminderSent: true },
      });
    }

    return NextResponse.json({ sent, tasks: dueTasks.length });
  } catch (error) {
    console.error("Cron reminders error:", error);
    return NextResponse.json(
      { error: "Failed to process reminders" },
      { status: 500 }
    );
  }
}
