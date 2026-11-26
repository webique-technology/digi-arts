
export const metadata = {
  title: "Return, Refund & Cancellation Policy | DIGI ART'S",
  description:
    "Return, Refund & Cancellation Policy of DIGI ART'S.",
};

const sections = [
  {
    title: "1. Return and Replacement Eligibility",
    paragraphs: [
      "Customers may request a return, replacement or refund under the following circumstances:",
    ],
    points: [
      "Product received in damaged condition.",
      "Product received with a manufacturing defect.",
      "Incorrect product received.",
      "Missing products or components from the ordered package.",
      "Product materially different from the description provided on our website.",
    ],
    after: [
      "Customers are requested to report such issues within 48 hours of delivery for prompt assistance.",
    ],
  },
  {
    title: "2. Non-Returnable Conditions",
    paragraphs: [
      "Returns or replacements for reasons unrelated to product defects or order discrepancies may not be accepted in the following circumstances:",
    ],
    points: [
      "Change of mind after purchase.",
      "Incorrect product selection by the customer.",
      "Minor colour variations due to photography, lighting or screen settings.",
      "Minor variations in dimensions, textures or finishes that do not materially affect the product.",
      "Damage caused by improper handling, storage, assembly or misuse after delivery.",
      "Products modified or altered by the customer.",
      "Customized or personalized products ordered according to customer specifications.",
    ],
    after: [
      "These conditions do not restrict any statutory consumer rights available under applicable Indian laws.",
    ],
  },
  {
    title: "3. How to Request a Return or Replacement",
    paragraphs: [
      "To request a return, replacement or refund, customers should contact our customer support team through the contact details provided on our website.",
      "Customers are requested to provide:",
    ],
    points: [
      "Order number.",
      "Registered name and contact details.",
      "Description of the issue.",
      "Clear photographs of the received product and packaging.",
      "Unboxing video, if available.",
    ],
    after: [
      "Photographs and unboxing videos help us verify and resolve complaints efficiently. The absence of an unboxing video will not automatically invalidate an otherwise genuine claim.",
      "Customers are requested to retain the original packaging, labels and product components until the issue is resolved, wherever reasonably possible.",
    ],
  },
  {
    title: "4. Return and Replacement Process",
    paragraphs: [
      "Once a request is received, our customer support team will review the details and determine the appropriate resolution.",
      "Eligible requests may be resolved through:",
    ],
    points: [
      "Replacement of the damaged, defective or incorrect product.",
      "Replacement of missing components.",
      "Full or applicable partial refund.",
    ],
    after: [
      "If a replacement product is unavailable, an applicable refund will be provided.",
      "Customers will not be charged additional shipping costs for approved returns or replacements resulting from damaged, defective, incorrect or materially misrepresented products.",
      "Customers should not send products back without receiving appropriate return instructions from our customer support team.",
    ],
  },
  {
    title: "5. Refund Policy",
    paragraphs: [
      "DIGI ART'S accepts prepaid orders only. Cash on Delivery (COD) is not available on our website.",
      "Eligible refunds will be issued under the following circumstances:",
    ],
    points: [
      "Approved return or refund request.",
      "Order cancellation before dispatch.",
      "Product unavailability.",
      "Order cancellation initiated by DIGI ART'S.",
      "Duplicate or excess payment, subject to verification.",
      "Failure to fulfil an order, where a refund is applicable.",
    ],
    after: [
      "Approved refunds will be processed to the original payment method used at the time of purchase.",
    ],
  },
  {
    title: "6. Refund Processing Timeline",
    paragraphs: [
      "Approved refunds will be processed within 5–7 working days from the date of refund approval.",
      "Additional time may be required by the customer's bank, payment gateway or financial service provider for the refunded amount to reflect in the customer's account.",
      "Applicable shipping charges will also be refunded where the refund results from our error, product defects, incorrect products or failure to fulfil the order, as required under applicable law.",
    ],
  },
  {
    title: "7. Order Cancellation",
    paragraphs: [
      "Customers may request cancellation of an order before it has been dispatched.",
      "To cancel an order, customers should contact our customer support team with their order details.",
      "Once an order has been dispatched, cancellation may not be available through the standard cancellation process.",
      "Approved cancellations before dispatch will be eligible for a full refund.",
      "Cancellation requests will be handled in accordance with applicable consumer protection laws.",
    ],
  },
  {
    title: "8. Cancellation by DIGI ART'S",
    paragraphs: [
      "We reserve the right to cancel an order for legitimate reasons, including:",
    ],
    points: [
      "Product unavailability.",
      "Genuine pricing or technical errors.",
      "Incorrect or incomplete shipping information.",
      "Delivery serviceability restrictions.",
      "Suspected fraudulent or unauthorized transactions.",
      "Unforeseen circumstances preventing order fulfilment.",
    ],
    after: [
      "If an order is cancelled by DIGI ART'S, the full amount paid for the cancelled order will be refunded to the original payment method.",
    ],
  },
  {
    title: "9. Product Colour and Size Variations",
    paragraphs: [
      "We make reasonable efforts to accurately display product colours, designs, dimensions and specifications on our website.",
      "Minor variations may occur due to photography, lighting, screen settings, material characteristics or manufacturing processes.",
      "Such minor variations will not ordinarily qualify for a return or refund unless they materially affect the product's quality, functionality or conformity with the advertised description.",
    ],
  },
  {
    title: "10. Consumer Rights",
    paragraphs: [
      "Nothing contained in this Return, Refund & Cancellation Policy is intended to exclude, restrict or override any statutory rights available to consumers under the Consumer Protection Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020, or other applicable Indian laws.",
      "The 48-hour reporting period is intended to facilitate prompt verification and resolution of complaints and does not automatically extinguish statutory consumer rights.",
    ],
  },
  {
    title: "11. Changes to This Policy",
    paragraphs: [
      "DIGI ART'S reserves the right to update or modify this policy from time to time.",
      "Any updated policy will be published on our website and will not unlawfully affect customers' rights relating to previously confirmed orders.",
    ],
  },
  {
    title: "12. Contact Information and Grievance Redressal",
    paragraphs: [
      "For return, replacement, refund, cancellation or order-related assistance, customers may contact our customer support team or designated grievance officer using the contact details provided on our website's Contact Us page.",
      "Consumer complaints will be acknowledged within 48 hours and addressed within one month from the date of receipt, in accordance with applicable e-commerce requirements.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <main className="legal-page">
      <div className="container">
        <div className="legal-page__header">
          <h1>Return, Refund & Cancellation Policy</h1>
        </div>

        <div className="legal-page__content">
          <p>
            At DIGI ART'S (www.digiarts.co.in), we are committed to
            providing quality products and a reliable shopping
            experience. Our Return, Refund & Cancellation Policy
            outlines the conditions and procedures for order
            cancellations, returns, replacements and refunds.
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
