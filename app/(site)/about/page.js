import Link from 'next/link';
import Visual from '@/components/Visual';
import { HOME } from '@/data/site';
import { TEST_IDS } from '@/components/testIds';
export const metadata = { title: 'About Us', description: 'The story behind Damani: made with love in Jaipur.', alternates: { canonical: '/about' } };

export default function About() {
  const story = HOME.story;
  return (
    <>
      <section className="editorial-head">
        <div className="container"><p className="editorial-head__eyebrow">{story.eyebrow}</p><h1>{story.title}</h1>
          <p>Thoughtful pieces for the moments you want to make memorable.</p></div>
      </section>
      <section className="about-story section">
        <div className="container about-story__layout">
          <Visual className="about-story__image" src={story.image} tone={story.tone} alt="Damani gift packaging and stationery" priority />
          <div className="about-story__copy">
            <p className="editorial-kicker">A little about us</p>
            <h2>Make the moment feel personal</h2>
            {story.text.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            <div className="about-story__actions">
              <Link href="/products" className="btn" data-testid={TEST_IDS.aboutShop}>Explore the collection</Link>
              <Link href="/contact" className="text-link" data-testid={TEST_IDS.aboutContact}>Talk to our team</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="about-values">
        <div className="container">
          <div className="about-values__heading"><p className="editorial-kicker">The Damani touch</p><h2>Made for sharing</h2></div>
          <div className="about-values__grid">
            <article><span>01</span><h3>Thoughtful details</h3><p>Small design choices help turn a gift into a keepsake.</p></article>
            <article><span>02</span><h3>Crafted with care</h3><p>Our collections bring color, texture and a handmade feel to your celebrations.</p></article>
            <article><span>03</span><h3>For every occasion</h3><p>Find gift bags, boxes, décor and stationery for moments big and small.</p></article>
          </div>
        </div>
      </section>
    </>
  );
}
