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
import { getCategoryTiles } from "@/lib/catalog";
import Testimonials from "@/components/Testimonials";
import TrustStrip from "@/components/TrustStrip";

// 1. Import demo products JSON directly (replaces the missing productData.js)
import demoProductsData from "@/data/demoCatalog.json";
import BlogSection from "@/components/blog/BlogSection";
import { getBlogs } from "@/lib/blogs";

export const revalidate = 15;
export const metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [b, best, smallBags, categoryTiles, blogPosts] = await Promise.all([
    getPublic("/banners"),
    getPublic("/products?bestseller=1&limit=6"), // Increased limit to 6 for the 6 cards
    getPublic("/products?category=small-bags&limit=4"),
    getCategoryTiles(),
    getBlogs(15),
  ]);

  // Safely extract JSON array whether it is a direct array or { products: [...] }
  const fallbackProducts = Array.isArray(demoProductsData)
    ? demoProductsData
    : demoProductsData?.products || demoProductsData?.data || [];

  // Use API products if available; otherwise use demoProduct.json
  let products = best?.data?.length ? best.data : fallbackProducts;

  const banners = b?.data || [];
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
      <ShopByCategory items={categoryTiles || undefined} />
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
      {blogPosts.length > 0 && <BlogSection posts={blogPosts} />}
      <TrustStrip />
      {/* <Features /> */}
    </>
  );
}
