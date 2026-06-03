import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const event = await verifyWebhook(request);
    const validRoles = ["SUPER_ADMIN", "ADMIN", "AGENT", "CLIENT"] as const;

    if (event.type === "user.created" || event.type === "user.updated") {
      const data = event.data;
      const email =
        data.email_addresses?.find(
          (e) => e.id === data.primary_email_address_id
        )?.email_address ?? data.email_addresses?.[0]?.email_address;

      if (!email) {
        return NextResponse.json({ ok: true });
      }

      const roleMeta = (data.public_metadata as { role?: string } | undefined)?.role;
      const hasValidRole =
        roleMeta && validRoles.includes(roleMeta as (typeof validRoles)[number]);

      if (event.type === "user.created") {
        const role = hasValidRole
          ? (roleMeta as (typeof validRoles)[number])
          : "CLIENT";

        await prisma.user.upsert({
          where: { clerkId: data.id },
          create: {
            clerkId: data.id,
            email,
            name: [data.first_name, data.last_name].filter(Boolean).join(" ") || null,
            avatarUrl: data.image_url ?? null,
            role,
          },
          update: {
            email,
            name: [data.first_name, data.last_name].filter(Boolean).join(" ") || null,
            avatarUrl: data.image_url ?? null,
            role,
          },
        });
      } else {
        await prisma.user.upsert({
          where: { clerkId: data.id },
          create: {
            clerkId: data.id,
            email,
            name: [data.first_name, data.last_name].filter(Boolean).join(" ") || null,
            avatarUrl: data.image_url ?? null,
            role: hasValidRole ? (roleMeta as (typeof validRoles)[number]) : "CLIENT",
          },
          update: {
            email,
            name: [data.first_name, data.last_name].filter(Boolean).join(" ") || null,
            avatarUrl: data.image_url ?? null,
            ...(hasValidRole ? { role: roleMeta as (typeof validRoles)[number] } : {}),
          },
        });
      }
    }

    if (event.type === "user.deleted") {
      await prisma.user.updateMany({
        where: { clerkId: event.data.id },
        data: { active: false },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
