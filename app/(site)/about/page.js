import Link from "next/link";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiHeart,
  FiPackage,
  FiStar,
  FiTruck,
} from "react-icons/fi";

const categories = [
  "Diwali Kandils & Festive Hangings",
  "MDF Decorations & Rangoli Sets",
  "DIY Craft Kits & Pooja Decorations",
  "Decorative Gift Boxes & Sweet Packaging",
];

const benefits = [
  {
    icon: <FiStar />,
    title: "Creative Designs",
    text: "Unique designs that bring a special touch to every celebration.",
  },
  {
    icon: <FiCheckCircle />,
    title: "Quality Focused",
    text: "Carefully selected materials and attractive product finishing.",
  },
  {
    icon: <FiHeart />,
    title: "Made for Celebrations",
    text: "Products inspired by Indian traditions and modern creativity.",
  },
  {
    icon: <FiPackage />,
    title: "Easy Online Shopping",
    text: "Explore our festive collection through our website and online marketplaces.",
  },
];

export default function AboutPage() {
  return (
    <main className="da-about">
      <section className="da-about__hero">
        <div className="container">
          <div className="da-about__hero-grid">
            <div className="da-about__hero-content">
              <span className="da-about__eyebrow">A LITTLE ABOUT US</span>

              <h1>
                Creativity that
                <br />
                makes every
                <br />
                <span>celebration special.</span>
              </h1>

              <p>
                From festive decorations to thoughtful gift packaging, we bring
                creative ideas to life for your special moments.
              </p>

              <Link href="/products" className="da-about__button">
                Explore Our Collection <FiArrowUpRight />
              </Link>
            </div>

            <div className="da-about__hero-art">
              <div className="da-about__image-main">
                <div className="da-about__image-placeholder">
                  <span>MADE FOR</span>
                  <strong>
                    Beautiful
                    <br />
                    Celebrations
                  </strong>
                  <small>DIGI ART’S STORE</small>
                </div>
              </div>
              <div className="da-about__floating-note">
                <FiHeart />
                <span>
                  Creativity in
                  <br />
                  every detail
                </span>
              </div>
              <span className="da-about__decor da-about__decor--one">✳</span>
              <span className="da-about__decor da-about__decor--two">✦</span>
            </div>
          </div>
        </div>
      </section>

      <section className="da-about__story">
        <div className="container">
          <div className="da-about__story-grid">
            <div className="da-about__story-label">
              <span className="da-about__eyebrow">OUR STORY</span>
              <h2>
                Little details.
                <br />
                <span>Lasting memories.</span>
              </h2>
            </div>

            <div className="da-about__story-copy">
              <p>
                DIGI ARTS STORE is a Nashik, Maharashtra-based brand bringing
                together creative, traditional, and modern decoration products
                for celebrations across India.
              </p>
              <p>
                We believe decorations are more than just details. They help
                create an atmosphere, express traditions, and make precious
                moments even more memorable.
              </p>
              <p>
                Our collection includes festive hangings, Diwali kandils, MDF
                decorations, rangoli sets, DIY craft kits, pooja decorations,
                decorative gift boxes, and sweet packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="da-about__offer">
        <div className="container">
          <div className="da-about__section-heading">
            <span className="da-about__eyebrow">OUR COLLECTION</span>
            <h2>
              Something special for <span>every occasion.</span>
            </h2>
            <p>
              Discover thoughtful details that add colour, creativity, and
              tradition to your celebrations.
            </p>
          </div>

          <div className="da-about__category-grid">
            {categories.map((category, index) => (
              <div className="da-about__category" key={category}>
                <span>0{index + 1}</span>
                <h3>{category}</h3>
                <FiArrowUpRight />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="da-about__why">
        <div className="container">
          <div className="da-about__section-heading">
            <span className="da-about__eyebrow">WHY DIGI ART’S</span>
            <h2>
              Thoughtful products. <span>Joyful moments.</span>
            </h2>
          </div>

          <div className="da-about__benefits">
            {benefits.map((benefit, index) => (
              <article className="da-about__benefit" key={benefit.title}>
                <div className="da-about__benefit-icon">{benefit.icon}</div>
                <span className="da-about__benefit-number">0{index + 1}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="da-about__reach">
        <div className="container">
          <div className="da-about__reach-inner">
            <div>
              <span className="da-about__eyebrow">FROM NASHIK TO INDIA</span>
              <h2>Celebrations have no boundaries.</h2>
              <p>
                Based in Nashik, Maharashtra, DIGI ARTS STORE makes its products
                accessible to customers across India through our official
                website and online marketplaces, including Amazon, Flipkart, and
                Meesho.
              </p>
            </div>
            <div className="da-about__reach-icon">
              <FiTruck />
              <span>
                Online shopping
                <br />
                made convenient
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="da-about__cta">
        <div className="container">
          <span className="da-about__eyebrow">LET’S CELEBRATE</span>
          <h2>
            Make room for a little more <span>magic.</span>
          </h2>
          <p>Find the finishing touches for your next celebration.</p>
          <Link
            href="/products"
            className="da-about__button da-about__button--light"
          >
            Shop the Collection <FiArrowUpRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
