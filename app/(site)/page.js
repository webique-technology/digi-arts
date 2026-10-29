import BannerSlider from "@/components/BannerSlider";
import FestivalCollections from "@/components/FestivalCollections";
import ShopByCategory from "@/components/ShopByCategory";
import FeaturedProducts from "@/components/FeaturedProducts";
import {
  CollectionTiles,
  CustomOrders,
  BestSellers,
  InstagramRow,
  SplitBanner,
  CollectionCards,
  Story,
  Features,
} from "@/components/home/Sections";
import { getPublic } from "@/lib/api";
import { HERO_FALLBACK } from "@/data/site";
import Testimonials from "@/components/Testimonials";
import TrustStrip from "@/components/TrustStrip";

// 1. Import demo products JSON directly (replaces the missing productData.js)
import demoProductsData from "@/data/demoCatalog.json";
import BlogSection from "@/components/blog/BlogSection";
import { BLOG_POSTS } from "@/data/blogData";

export const revalidate = 15;
export const metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [b, best, smallBags] = await Promise.all([
    getPublic("/banners"),
    getPublic("/products?bestseller=1&limit=6"), // Increased limit to 6 for the 6 cards
    getPublic("/products?category=small-bags&limit=4"),
  ]);

  // Safely extract JSON array whether it is a direct array or { products: [...] }
  const fallbackProducts = Array.isArray(demoProductsData)
    ? demoProductsData
    : demoProductsData?.products || demoProductsData?.data || [];

  // Use API products if available; otherwise use demoProduct.json
  let products = best?.data?.length ? best.data : fallbackProducts;

  const banners = b?.data?.length ? b.data : HERO_FALLBACK;
  const smallBagsProducts = Array.isArray(smallBags)
    ? smallBags
    : Array.isArray(smallBags?.data)
      ? smallBags.data
      : Array.isArray(smallBags?.data?.data)
        ? smallBags.data.data
        : [];

  return (
    <>
      <h1 className="sr-only">
        Digi Art's - Handcrafted Bags, Accessories, and Home Decor
      </h1>

      <BannerSlider banners={banners} />
      <ShopByCategory />
      <FestivalCollections />
      <FeaturedProducts products={products} />
      {/* <CollectionTiles /> */}

      {/* Passing products (will fall back to demoProduct.json if API is empty) */}
      <BestSellers products={products} />

      {/* <CustomOrders /> */}
      <InstagramRow />
      {/* <SplitBanner /> */}
      {/* <CollectionCards /> */}
      {/* <Story /> */}
      <Testimonials />
      <BlogSection posts={BLOG_POSTS}/>
      <TrustStrip />
      {/* <Features /> */}
    </>
  );
}
