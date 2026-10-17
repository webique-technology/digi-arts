


import ProductCard from './DummyProductCard';
// Temporary frontend data.
// Later replace with admin/API data.


export default function FeaturedProducts({
  products = demoDeals,
  title = 'Deals of the Day',
}) {
  const deals = products.slice(0, 12);

  return (
    <section className="featured-products mt-5 mb-10" aria-label="Featured Products">
      <div className="fp-decoration fp-decoration-one" />
      <div className="fp-decoration fp-decoration-two" />

      <div className="container fp-container">
        <div className="best-sellers__header">
          
          <h2 className="shop-category__title fp-heading">
            {title.split(' of the ')[0]} of the{' '}
            <span>Day</span>
          </h2>
        <div className="best-sellers__actions">
            
            <a href="/shop" className="best-sellers__view-all">
            Explore All Products <span>↗</span>
          </a>

            
        </div>
          </div>
<ProductCard />
        <div className="fp-carousel">
          <div className="fp-track">
           
          </div>
        </div>

       
      </div>
    </section>
  );
}
