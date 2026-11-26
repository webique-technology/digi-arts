
export const metadata = {
  title: "Privacy Policy | DIGI ART'S",
  description: "Privacy Policy of DIGI ART'S.",
};

const sections = [
  {
    title: "1. Information We Collect",
    paragraphs: [
      "We may collect the following information when you visit our website, create an account, place an order or contact our customer support team:",
    ],
    points: [
      "Full name",
      "Email address",
      "Mobile number",
      "Billing and shipping address",
      "Order and purchase history",
      "Payment and transaction information",
      "Customer feedback and communications",
      "IP address, browser type and device information",
      "Website browsing activity and preferences",
    ],
    after: [
      "We collect personal information as reasonably necessary to provide our products and services, operate our website and fulfil applicable legal obligations.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    paragraphs: [
      "We may use your personal information for the following purposes:",
    ],
    points: [
      "Processing and fulfilling customer orders.",
      "Verifying payments and transactions.",
      "Arranging shipping and delivery.",
      "Providing order confirmations and tracking updates.",
      "Processing cancellations, replacements and refunds.",
      "Providing customer support.",
      "Improving our website, products and services.",
      "Sending promotional offers and product updates, subject to applicable consent requirements.",
      "Preventing fraudulent and unauthorized transactions.",
      "Complying with applicable legal and regulatory requirements.",
    ],
  },
  {
    title: "3. Payment Information and Security",
    paragraphs: [
      "DIGI ART'S accepts prepaid orders through the online payment methods available on our website.",
      "Online payments are processed through third-party payment gateways.",
      "We do not request customers to share their banking passwords, UPI PINs or One-Time Passwords (OTPs) with our customer support team.",
      "Payment gateways may independently collect and process payment-related information in accordance with their respective privacy policies and applicable security requirements.",
    ],
  },
  {
    title: "4. Sharing of Personal Information",
    paragraphs: [
      "We do not sell or rent your personal information to third parties.",
      "We may share necessary information with authorized service providers for legitimate business purposes, including:",
    ],
    points: [
      "Payment gateway providers.",
      "Courier and logistics partners.",
      "Website hosting and technology providers.",
      "Customer support service providers.",
      "Marketing and analytics service providers, where permitted by applicable law.",
      "Government or regulatory authorities when legally required.",
    ],
    after: [
      "Such information is shared only as reasonably necessary for the relevant purpose and subject to applicable privacy and data protection requirements.",
    ],
  },
  {
    title: "5. Cookies and Tracking Technologies",
    paragraphs: [
      "Our website may use cookies and similar technologies to improve your browsing and shopping experience.",
      "These technologies may be used to:",
    ],
    points: [
      "Remember customer preferences.",
      "Maintain shopping cart information.",
      "Improve website functionality.",
      "Analyse website traffic and performance.",
      "Provide relevant product recommendations.",
      "Display relevant advertisements, subject to applicable consent requirements.",
    ],
    after: [
      "Customers may manage or disable cookies through their browser settings. However, disabling certain cookies may affect some website features and functionality.",
    ],
  },
  {
    title: "6. Data Security",
    paragraphs: [
      "We take reasonable technical and organizational measures to protect personal information against unauthorized access, misuse, alteration, disclosure or loss.",
      "However, no method of electronic transmission or data storage can guarantee absolute security.",
      "Customers are encouraged to maintain the confidentiality of their account credentials and avoid sharing sensitive financial or personal information with unauthorized persons.",
    ],
  },
  {
    title: "7. Data Retention",
    paragraphs: [
      "We retain personal information only for as long as reasonably necessary to fulfil the purposes described in this Privacy Policy, including order processing, customer support, accounting, taxation, dispute resolution and legal compliance.",
      "When personal information is no longer required, we will take appropriate steps to securely delete or anonymize it, subject to applicable legal requirements.",
    ],
  },
  {
    title: "8. Marketing and Promotional Communications",
    paragraphs: [
      "We may send information regarding new products, festive collections, special offers, discounts and promotional campaigns, subject to applicable consent requirements.",
      "Customers may unsubscribe from promotional communications using the unsubscribe option, where available, or by contacting our customer support team.",
      "Opting out of promotional communications will not affect essential communications relating to orders, payments, shipping, refunds or customer support.",
    ],
  },
  {
    title: "9. Third-Party Websites and Services",
    paragraphs: [
      "Our website may contain links to third-party websites or integrate services provided by external service providers.",
      "These third parties may have their own privacy policies and terms of service.",
      "DIGI ART'S is not responsible for the independent privacy practices or content of third-party websites, except where responsibility is imposed on us under applicable law.",
      "Customers are encouraged to review the privacy policies of third-party websites before sharing personal information.",
    ],
  },
  {
    title: "10. Your Privacy Rights",
    paragraphs: [
      "Subject to applicable Indian data protection laws, you may have the right to:",
    ],
    points: [
      "Access information about your personal data.",
      "Request correction or updating of inaccurate personal information.",
      "Request deletion of personal information, subject to legal retention requirements.",
      "Withdraw consent where personal data processing is based on consent.",
      "Opt out of promotional communications.",
      "Raise complaints regarding the processing of your personal information.",
      "Exercise other rights available under applicable data protection laws.",
    ],
    after: [
      "Customers may exercise these rights by contacting us through the contact details available on our website.",
      "We may request reasonable identity verification before processing certain privacy-related requests.",
    ],
  },
  {
    title: "11. Children's Privacy",
    paragraphs: [
      "Our website is intended for general shopping purposes and is not specifically directed towards children.",
      "Individuals under 18 years of age should use our website under the supervision of a parent or legal guardian.",
      "Where applicable, we will obtain verifiable parental or guardian consent before processing children's personal data and comply with applicable legal restrictions on such processing.",
    ],
  },
  {
    title: "12. Legal Compliance",
    paragraphs: [
      "We handle personal information in accordance with applicable Indian laws, including relevant provisions of the Digital Personal Data Protection Act, 2023, and other applicable data protection, information technology and consumer protection laws, to the extent in force.",
      "Nothing in this Privacy Policy is intended to restrict or override any privacy or consumer rights available under applicable law.",
    ],
  },
  {
    title: "13. Changes to This Privacy Policy",
    paragraphs: [
      "DIGI ART'S reserves the right to update or modify this Privacy Policy from time to time to reflect changes in our business practices, website functionality or legal requirements.",
      "Updated versions of this Privacy Policy will be published on our website.",
      "Where required by applicable law, we will provide appropriate notice of material changes or obtain fresh consent.",
    ],
  },
  {
    title: "14. Contact Information and Grievance Redressal",
    paragraphs: [
      "For any questions, concerns, complaints or requests relating to this Privacy Policy or the handling of your personal information, please contact our customer support team or designated grievance officer using the contact details provided on our website's Contact Us page.",
      "We will make reasonable efforts to address privacy-related concerns within the timelines prescribed under applicable laws.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <div className="container">
        <div className="legal-page__header">
          <h1>Privacy Policy</h1>
        </div>

        <div className="legal-page__content">
          <p>
            At DIGI ART'S (www.digiarts.co.in), we respect your privacy
            and are committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, store,
            share and protect your information when you visit our
            website, purchase our products or communicate with us.
          </p>

          <p>
            By using our website, you acknowledge the practices
            described in this Privacy Policy.
          </p>

          {sections.map((section, index) => (
            <section className="legal-page__section" key={index}>
              <h2>{section.title}</h2>

              {section.paragraphs?.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}

              {section.points && (
                <ul>
                  {section.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}

              {section.after?.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </section>
          ))}

          <div className="legal-page__contact">
            <h2>DIGI ART'S</h2>
            <p>Website: www.digiarts.co.in</p>
          </div>
        </div>
      </div>
    </main>
  );
}
