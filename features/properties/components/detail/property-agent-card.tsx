import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPhoneHref, getWhatsAppUrl } from "@/lib/constants";
import type { PropertyAgent } from "@/types/property";

type PropertyAgentCardProps = {
  agent: PropertyAgent;
  propertyTitle: string;
};

export function PropertyAgentCard({ agent, propertyTitle }: PropertyAgentCardProps) {
  const whatsappMessage = `Hello ${agent.name}, I am interested in: ${propertyTitle}. Please contact me.`;

  return (
    <section
      className="rounded-2xl border border-border/80 bg-muted/20 p-6"
      aria-labelledby="agent-heading"
    >
      <h2
        id="agent-heading"
        className="font-heading text-h4 font-semibold text-foreground"
      >
        Your Property Advisor
      </h2>

      <div className="mt-5 flex items-start gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-primary/20">
          <Image
            src={agent.photoUrl}
            alt={agent.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div>
          <p className="font-heading text-lg font-semibold text-foreground">
            {agent.name}
          </p>
          <p className="text-sm text-muted-foreground">{agent.designation}</p>
        </div>
      </div>

      <ul className="mt-5 space-y-3 text-sm" role="list">
        <li>
          <a
            href={getPhoneHref()}
            className="inline-flex items-center gap-3 text-foreground/80 transition-colors hover:text-primary"
          >
            <Phone className="size-4 text-primary" aria-hidden="true" />
            {agent.phone}
          </a>
        </li>
        <li>
          <a
            href={getWhatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-foreground/80 transition-colors hover:text-[#25D366]"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            WhatsApp
          </a>
        </li>
        <li>
          <a
            href={`mailto:${agent.email}`}
            className="inline-flex items-center gap-3 text-foreground/80 transition-colors hover:text-primary"
          >
            <Mail className="size-4 text-primary" aria-hidden="true" />
            {agent.email}
          </a>
        </li>
      </ul>

      <Button
        render={<Link href="/contact" />}
        className="mt-5 w-full bg-primary font-semibold text-secondary hover:bg-primary/90"
      >
        Contact Agent
      </Button>
    </section>
  );
}
