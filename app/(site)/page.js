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

export const revalidate = 15;
export const metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [b, best, smallBags] = await Promise.all([
    getPublic("/banners"),
    getPublic("/products?bestseller=1&limit=4"),
    getPublic("/products?category=small-bags&limit=4"),
  ]);

  let products = best?.data || [];

  if (!products.length) {
    products = (await getPublic("/products?limit=4"))?.data || [];
  }

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
      <CollectionTiles />

      <BestSellers products={smallBagsProducts} />

      {/* <CustomOrders /> */}
      <InstagramRow />
      {/* <SplitBanner /> */}
      {/* <CollectionCards /> */}
      {/* <Story /> */}
      <Testimonials />
      <Features />
    </>
  );
}
