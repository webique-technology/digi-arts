
import { getPublicResult, imageUrl } from '@/lib/api';
import {
  DEMO_PRODUCTS,
  isCatalogUnavailable,
  isDemoCatalogPreviewEnabled,
} from '@/lib/catalog';
import BulkOrderForm from './BulkOrderForm';

export const metadata = {
  title: 'Bulk Order Enquiry | Digi Art’s Store',
  description: 'Send your bulk order enquiry to Digi Art’s Store.',
};

async function loadProduct(slug) {
  const result = await getPublicResult(
    `/products/${encodeURIComponent(slug)}`,
    15
  );

  if (
    result.data ||
    !isDemoCatalogPreviewEnabled ||
    !isCatalogUnavailable(result)
  ) {
    return result.data;
  }

  return DEMO_PRODUCTS.find((item) => item.slug === slug) || null;
}

export default async function BulkOrderPage({ searchParams }) {
  const params = await searchParams;
  const slug = params?.product || '';

  let selectedProduct = null;

  if (slug) {
    const product = await loadProduct(slug);

    if (product) {
      const imagePath =
        product.images?.[0]?.image_path || product.primary_image;

      selectedProduct = {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        sku: product.sku || '',
        image: imagePath ? imageUrl(imagePath) : '',
      };
    }
  }

  return (
    <main className="container">
      <BulkOrderForm selectedProduct={selectedProduct} />
    </main>
  );
}
