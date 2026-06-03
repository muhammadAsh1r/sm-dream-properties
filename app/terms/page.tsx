import type { Metadata } from "next";

import { getPublicSiteConfig } from "@/features/content/queries/public";
import { LegalPageContent } from "@/features/legal/components/legal-page-content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteConfig();
  return {
    title: "Terms of Service",
    description: `Terms of service for using ${site.name} website and services.`,
    alternates: {
      canonical: `${site.url}/terms`,
    },
  };
}

export default async function TermsPage() {
  const site = await getPublicSiteConfig();

  return (
    <LegalPageContent
      title="Terms of Service"
      intro={`By accessing ${site.url}, you agree to these terms governing use of ${site.name} website and services.`}
      sections={[
        {
          title: "Use of the website",
          paragraphs: [
            "Property listings, pricing, and availability are subject to change without notice. Information is provided for general guidance and does not constitute a binding offer.",
            "You agree not to misuse the website, attempt unauthorized access, or submit false inquiry information.",
          ],
        },
        {
          title: "Advisory and transactions",
          paragraphs: [
            "Our team provides real estate advisory services. Final terms of any property transaction are governed by separate written agreements between buyers, sellers, and relevant parties.",
            "We strive for accuracy in listings but do not guarantee that all property details are complete or error-free.",
          ],
        },
        {
          title: "Limitation of liability",
          paragraphs: [
            `${site.name} is not liable for indirect or consequential damages arising from use of this website or reliance on listing information.`,
            "To the extent permitted by law, our total liability is limited to the amount paid to us for the specific service giving rise to the claim, if any.",
          ],
        },
        {
          title: "Changes and contact",
          paragraphs: [
            "We may update these terms from time to time. Continued use of the website after changes constitutes acceptance of the updated terms.",
            `Questions about these terms can be sent to ${site.contact.email}.`,
          ],
        },
      ]}
    />
  );
}
