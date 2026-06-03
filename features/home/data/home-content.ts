import {
  BadgeCheck,
  Building2,
  ChartLine,
  FileCheck,
  Handshake,
  MapPinned,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

export const heroContent = {
  headline: "Find Premium Property Opportunities In Faisal Town Islamabad",
  subheadline:
    "Buy, Sell, Invest, and Grow with trusted property experts and professional logistics services.",
  trustBadges: [
    "Verified Listings",
    "Trusted Advisors",
    "Investment Opportunities",
  ],
  image:
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  imageAlt: "Luxury modern villa in Islamabad with panoramic views",
};

export const trustBarItems = [
  { label: "Verified Listings", icon: ShieldCheck },
  { label: "Professional Advisors", icon: Users },
  { label: "Market Experts", icon: ChartLine },
  { label: "Transparent Transactions", icon: Handshake },
] as const;

export const homeServices = [
  {
    title: "Buy Property",
    description:
      "Discover verified residential and commercial listings across Faisal Town with expert guidance at every step.",
    icon: Building2,
    href: "/properties?type=buy",
  },
  {
    title: "Sell Property",
    description:
      "Maximize your property value with strategic marketing, professional valuation, and qualified buyer networks.",
    icon: TrendingUp,
    href: "/services#sell",
  },
  {
    title: "Investment Consultancy",
    description:
      "Access data-driven investment insights, ROI analysis, and portfolio strategies tailored to Islamabad's market.",
    icon: ChartLine,
    href: "/services#investment",
  },
  {
    title: "Logistics Services",
    description:
      "End-to-end transportation and fleet solutions supporting your commercial operations across Pakistan.",
    icon: Truck,
    href: "/logistics",
  },
] as const;

export const whyChooseUsFeatures: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Verified Listings",
    description:
      "Every property is thoroughly vetted for legal clarity, ownership documentation, and market authenticity.",
    icon: BadgeCheck,
  },
  {
    title: "Market Knowledge",
    description:
      "Deep expertise in Faisal Town pricing trends, block-level demand, and emerging investment corridors.",
    icon: ChartLine,
  },
  {
    title: "Fast Documentation",
    description:
      "Streamlined transfer processes with dedicated support for NOC, registry, and legal compliance.",
    icon: FileCheck,
  },
  {
    title: "Trusted Consultants",
    description:
      "Experienced advisors who prioritize transparency, integrity, and long-term client relationships.",
    icon: Handshake,
  },
  {
    title: "Local Expertise",
    description:
      "Born and operating in Faisal Town — we know every block, developer, and opportunity firsthand.",
    icon: MapPinned,
  },
  {
    title: "Investment Guidance",
    description:
      "Strategic portfolio advice backed by market data, rental yields, and capital appreciation forecasts.",
    icon: TrendingUp,
  },
];

export const investmentOpportunities = [
  {
    title: "Residential Plots",
    description:
      "Prime corner and boulevard plots in high-demand Faisal Town blocks with strong appreciation potential.",
    roi: "12–18% annual growth",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    href: "/properties?category=plot",
  },
  {
    title: "Commercial Plots",
    description:
      "Main Markaz and commercial zone plots ideal for retail, offices, and mixed-use developments.",
    roi: "15–22% ROI potential",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    href: "/properties?category=commercial",
  },
  {
    title: "Houses",
    description:
      "Ready and under-construction houses in A–D blocks offering rental income and family living value.",
    roi: "8–12% rental yield",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    href: "/properties?category=residential",
  },
  {
    title: "Apartments",
    description:
      "Modern apartments near Main Markaz with premium amenities and strong tenant demand.",
    roi: "9–14% rental yield",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    href: "/properties?category=residential",
  },
] as const;

export const logisticsContent = {
  headline: "Reliable Logistics Solutions Across Pakistan",
  subheadline:
    "From Faisal Town to nationwide delivery — professional fleet management and commercial transportation you can depend on.",
  image:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  services: [
    {
      title: "Goods Transportation",
      description: "Secure, timely freight movement for commercial and industrial cargo.",
      icon: Truck,
    },
    {
      title: "Fleet Management",
      description: "Optimized routing, maintenance, and dispatch for business fleets.",
      icon: Warehouse,
    },
    {
      title: "Commercial Logistics",
      description: "End-to-end supply chain support for retailers and enterprises.",
      icon: Building2,
    },
    {
      title: "Delivery Solutions",
      description: "Last-mile delivery services with real-time tracking and reliability.",
      icon: MapPinned,
    },
  ],
};

export const faqItems = [
  {
    question: "How do I buy property in Faisal Town?",
    answer:
      "Start by browsing our verified listings or contacting our advisors. We guide you through property selection, legal verification, negotiation, and complete transfer documentation — ensuring a secure, transparent purchase from start to finish.",
  },
  {
    question: "How do I verify a property before buying?",
    answer:
      "Our team conducts thorough due diligence including ownership verification, NOC status, encumbrance checks, and site inspections. Every listing on SM Dream Properties is pre-screened for legal clarity before publication.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "We specialize in Faisal Town Islamabad — all blocks including A, B, C, D, and Main Markaz — along with adjacent premium areas. Our logistics services extend nationwide across Pakistan.",
  },
  {
    question: "Do you provide logistics services?",
    answer:
      "Yes. SM Dream Properties offers comprehensive logistics solutions including goods transportation, fleet management, commercial logistics, and last-mile delivery services across Pakistan.",
  },
] as const;

export const finalCtaContent = {
  headline: "Ready To Find Your Dream Property?",
  subheadline:
    "Join 100+ satisfied clients who trusted SM Dream Properties for their real estate and logistics needs in Faisal Town.",
  urgency: "Limited premium listings available this month — speak with an advisor today.",
};
