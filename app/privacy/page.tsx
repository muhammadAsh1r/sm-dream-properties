import type { Metadata } from "next";

import { getPublicSiteConfig } from "@/features/content/queries/public";
import { LegalPageContent } from "@/features/legal/components/legal-page-content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteConfig();
  return {
    title: "Privacy Policy",
    description: `Privacy policy for ${site.name} — how we collect, use, and protect your information.`,
    alternates: {
      canonical: `${site.url}/privacy`,
    },
  };
}

export default async function PrivacyPage() {
  const site = await getPublicSiteConfig();

  return (
    <LegalPageContent
      title="Privacy Policy"
      intro={`This policy explains how ${site.name} ("we", "us") handles personal information when you use our website, contact us, or inquire about properties and services.`}
      sections={[
        {
          title: "Information we collect",
          paragraphs: [
            "We may collect your name, email address, phone number, and message content when you submit inquiry or contact forms.",
            "We also collect basic usage data such as pages visited and device information through standard analytics tools to improve our website.",
          ],
        },
        {
          title: "How we use information",
          paragraphs: [
            "We use your information to respond to property inquiries, schedule viewings, provide advisory services, and improve our customer experience.",
            "We do not sell your personal information to third parties.",
          ],
        },
        {
          title: "Data retention and security",
          paragraphs: [
            "We retain inquiry records for as long as needed to provide services and meet legal obligations.",
            "We apply reasonable technical and organizational measures to protect data, though no online system is completely secure.",
          ],
        },
        {
          title: "Your rights and contact",
          paragraphs: [
            "You may request access, correction, or deletion of your personal information by contacting us at the email or phone listed on our contact page.",
            `For privacy-related questions, email ${site.contact.email}.`,
          ],
        },
      ]}
    />
  );
}
