"use client";

import { MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatPropertyPrice,
  getPropertyWhatsAppMessage,
} from "@/features/properties/lib/property-utils";
import { getPhoneHref, getWhatsAppUrl } from "@/lib/constants";
import type { Property } from "@/types/property";

type PropertyMobileCtaProps = {
  property: Property;
};

export function PropertyMobileCta({ property }: PropertyMobileCtaProps) {
  const whatsappMessage = getPropertyWhatsAppMessage(property);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur-lg lg:hidden">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="truncate font-heading text-sm font-bold text-foreground">
          {formatPropertyPrice(property.price, property.currency, property.status)}
        </p>
        <p className="truncate text-xs text-muted-foreground">{property.propertyId}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          render={
            <a
              href={getWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
          className="h-11 bg-[#25D366] font-semibold text-white hover:bg-[#20bd5a]"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          WhatsApp
        </Button>
        <Button
          render={<a href={getPhoneHref()} />}
          className="h-11 bg-primary font-semibold text-secondary hover:bg-primary/90"
        >
          <Phone className="size-4" aria-hidden="true" />
          Call Now
        </Button>
      </div>
    </div>
  );
}
