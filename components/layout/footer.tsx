import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import type { PublicSiteConfig } from "@/features/content/queries/public";
import { footerNav } from "@/lib/constants";

const footerSections = [
  { title: "Company", links: footerNav.company },
  { title: "Properties", links: footerNav.properties },
  { title: "Services", links: footerNav.services },
] as const;

function whatsAppUrl(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "");
  if (!message) return `https://wa.me/${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function SocialLink({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: string;
}) {
  if (!href.trim()) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-brand-accent/40 hover:bg-brand-accent/10 hover:text-brand-accent"
    >
      {icon === "facebook" && (
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )}
      {icon === "instagram" && (
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )}
      {icon === "linkedin" && (
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )}
    </a>
  );
}

type FooterProps = {
  site: PublicSiteConfig;
};

export function Footer({ site }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { address, contact, social } = site;

  const socialLinks = [
    { label: "Facebook", href: social.facebook, icon: "facebook" },
    { label: "Instagram", href: social.instagram, icon: "instagram" },
    { label: "LinkedIn", href: social.linkedin, icon: "linkedin" },
  ].filter((link) => link.href.trim());

  const phoneHref = contact.phone
    ? `tel:${contact.phone.replace(/\s/g, "")}`
    : undefined;
  const whatsappHref = contact.whatsapp
    ? whatsAppUrl(
        contact.whatsapp,
        `Hi ${site.name}, I'd like to inquire about a property.`
      )
    : undefined;

  return (
    <footer className="border-t border-border bg-secondary text-white" role="contentinfo">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:gap-10">
          <div className="space-y-6">
            <Logo variant="light" />
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              {site.tagline
                ? `${site.tagline}. Premium real estate and logistics services in the heart of Faisal Town, Islamabad.`
                : site.description}
            </p>

            <div>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-white/90">
                Contact
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-white/80" role="list">
                {(address.line1 || address.line2 || address.line3) && (
                  <li className="flex items-start gap-3">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-brand-accent"
                      aria-hidden="true"
                    />
                    <address className="not-italic leading-relaxed">
                      {address.line1}
                      {address.line2 && (
                        <>
                          <br />
                          {address.line2}
                        </>
                      )}
                      {address.line3 && (
                        <>
                          <br />
                          {address.line3}
                        </>
                      )}
                    </address>
                  </li>
                )}
                {contact.phone && phoneHref && (
                  <li>
                    <a
                      href={phoneHref}
                      className="inline-flex items-center gap-3 transition-colors hover:text-brand-accent"
                      aria-label={`Call ${contact.phone}`}
                    >
                      <Phone className="size-4 shrink-0" aria-hidden="true" />
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.whatsapp && whatsappHref && (
                  <li>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 transition-colors hover:text-brand-accent"
                      aria-label="WhatsApp SM Dream Properties"
                    >
                      <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                      {contact.whatsapp}
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-3 transition-colors hover:text-brand-accent"
                      aria-label={`Email ${contact.email}`}
                    >
                      <Mail className="size-4 shrink-0" aria-hidden="true" />
                      {contact.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <SocialLink key={link.label} {...link} />
                ))}
              </div>
            )}
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-white/90">
                {section.title}
              </h2>
              <ul className="mt-5 space-y-3" role="list">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 transition-colors hover:text-brand-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col gap-4 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {currentYear} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white/80">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/80">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
