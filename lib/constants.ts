import type { NavItem } from "@/types/navigation";

export const siteConfig = {
  name: "SM Dream Properties",
  tagline: "Find Your Dream Property With Confidence",
  description:
    "Premium real estate and logistics services in Faisal Town, Islamabad. Trusted property advisors for buying, selling, and investing.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://smdreamproperties.com",
  location: {
    area: "Faisal Town",
    city: "Islamabad",
    country: "Pakistan",
    full: "Faisal Town, Islamabad, Pakistan",
    address: {
      line1: "B Block Main Markaz",
      line2: "Faisal Town",
      line3: "Islamabad",
    },
  },
  contact: {
    phone: "+92 300 1234567",
    email: "info@smdreamproperties.com",
    whatsapp: "+923001234567",
  },
  social: {
    facebook: "https://facebook.com/smdreamproperties",
    instagram: "https://instagram.com/smdreamproperties",
    linkedin: "https://linkedin.com/company/smdreamproperties",
  },
} as const;

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Logistics", href: "/logistics" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about#team" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  properties: [
    { label: "Buy Property", href: "/properties?type=buy" },
    { label: "Rent Property", href: "/properties?type=rent" },
    { label: "Commercial", href: "/properties?category=commercial" },
    { label: "Featured Listings", href: "/properties?featured=true" },
  ],
  services: [
    { label: "Buy Property", href: "/services#buy" },
    { label: "Sell Property", href: "/services#sell" },
    { label: "Investment Advisory", href: "/services#investment" },
    { label: "Logistics Solutions", href: "/logistics" },
  ],
} as const;

export function getWhatsAppUrl(message?: string) {
  const phone = siteConfig.contact.whatsapp.replace(/\D/g, "");
  if (!message) return `https://wa.me/${phone}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getPhoneHref() {
  return `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;
}
