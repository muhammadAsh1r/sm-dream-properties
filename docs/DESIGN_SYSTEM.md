# SM Dream Properties — Design System

Premium real-estate and logistics design foundation for **SM Dream Properties**, Faisal Town, Islamabad.

## Brand Identity

| Token | Value |
|-------|-------|
| Company | SM Dream Properties |
| Tagline | Find Your Dream Property With Confidence |
| Industry | Real Estate + Logistics |
| Location | Faisal Town, Islamabad, Pakistan |

## Color System

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary | `#00C8FF` | `--primary` / `--color-brand-primary` | CTAs, links, highlights |
| Secondary | `#0A0A0A` | `--secondary` / `--color-brand-secondary` | Footer, headings, contrast |
| Accent | `#D4AF37` | `--accent` / `--color-brand-accent` | Premium accents, badges |
| Background | `#FFFFFF` | `--background` | Page background |
| Muted | `#F8F9FA` | `--muted` | Section backgrounds |
| Border | `#E5E7EB` | `--border` | Dividers, inputs |
| Text | `#111827` | `--foreground` | Body copy |

Tokens live in `app/globals.css` (CSS) and `lib/design-tokens.ts` (JS/TS).

## Typography

| Scale | Font | Size (responsive) | Weight |
|-------|------|-------------------|--------|
| Hero | Montserrat | `clamp(2.75rem → 4.5rem)` | 700 |
| Display | Montserrat | `clamp(2.25rem → 3.5rem)` | 700 |
| H1 | Montserrat | `clamp(2rem → 3rem)` | 700 |
| H2 | Montserrat | `clamp(1.75rem → 2.25rem)` | 600 |
| H3 | Montserrat | `clamp(1.375rem → 1.75rem)` | 600 |
| H4 | Montserrat | `clamp(1.125rem → 1.375rem)` | 600 |
| Body Large | Inter | 1.125rem | 400 |
| Body | Inter | 1rem | 400 |
| Small | Inter | 0.875rem | 400 |

Use the `Typography` component or utility classes (`.text-hero`, `.text-h1`, etc.).

```tsx
import { Typography } from "@/components/design-system/typography";

<Typography variant="h2">Featured Properties</Typography>
```

## Buttons

Built on Shadcn UI with brand styling in `components/ui/button.tsx`.

| Variant | Use Case |
|---------|----------|
| `default` | Primary CTA — cyan background, dark text |
| `secondary` | Dark premium actions |
| `outline` | Secondary actions on light backgrounds |
| `ghost` | Tertiary / nav-adjacent actions |

Sizes: `sm`, `default`, `lg`, `xl`

## Badges

| Variant | Label |
|---------|-------|
| `featured` | Featured listings |
| `newListing` | New arrivals |
| `forSale` | Sale properties |
| `forRent` | Rental properties |

## Cards

| Component | Path | Purpose |
|-----------|------|---------|
| PropertyCard | `components/design-system/property-card.tsx` | Listing previews |
| ServiceCard | `components/design-system/service-card.tsx` | Service offerings |
| TestimonialCard | `components/design-system/testimonial-card.tsx` | Client reviews |

All cards use subtle elevation (`.shadow-card`) and lift-on-hover via `CardLift`.

## Forms

| Component | Path | Validation |
|-----------|------|------------|
| ContactForm | `components/forms/contact-form.tsx` | Zod + React Hook Form |
| InquiryForm | `components/forms/inquiry-form.tsx` | Zod + React Hook Form |

Schemas: `types/forms.ts`  
Server actions scaffold: `actions/contact.ts`

## Animation System

Framer Motion variants in `lib/animations.ts`:

| Motion | Component | Effect |
|--------|-----------|--------|
| Fade Up | `FadeUp` | Scroll-triggered upward reveal |
| Fade In | `FadeIn` | Opacity reveal |
| Scale Hover | `ScaleHover` | Subtle 1.02 scale on hover |
| Card Lift | `CardLift` | Elevation + translate on hover |

Timing: premium ease `[0.22, 1, 0.36, 1]`, 0.2–0.6s durations.

## Layout

| Component | Path | Role |
|-----------|------|------|
| SiteLayout | `components/layout/site-layout.tsx` | Shell wrapper |
| Navbar | `components/layout/navbar.tsx` | Sticky header, mobile menu |
| Footer | `components/layout/footer.tsx` | 4-column footer |
| Container | `components/layout/container.tsx` | Max-width content |
| Section | `components/layout/section.tsx` | Vertical rhythm |

Breakpoints: mobile-first via Tailwind (`sm`, `md`, `lg`, `xl`, `2xl`).

## Project Architecture

```
app/           → Routes, layouts, global styles
components/    → Shared UI, layout, design system
features/      → Domain modules (properties, services, logistics)
lib/           → Tokens, fonts, animations, prisma, analytics
hooks/         → Reusable client hooks
types/         → Shared TypeScript types
actions/       → Server actions
prisma/        → Database schema
public/        → Static assets
docs/          → Documentation
```

## Accessibility

- Semantic HTML landmarks (`header`, `main`, `footer`, `nav`)
- Skip-to-content link in root layout
- ARIA labels on interactive controls
- Form field error announcements via `role="alert"`
- Keyboard-focus rings on all interactive elements
- WCAG AA contrast on primary text/background pairs

## Getting Started

```bash
cp .env.example .env.local
npm install
npm run db:generate
npm run dev
```

Configure Clerk, PostgreSQL, PostHog, and Google Analytics via environment variables before production deployment.
