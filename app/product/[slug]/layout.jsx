import { getProductBySlug } from '@/lib/products';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Banner Direct',
      description: 'The requested product could not be found.',
    };
  }

  const productName = product.title || product.name;
  const title = product.meta_title || `${productName} | Custom Banner Printing Canada`;
  const description =
    product.meta_description ||
    product.description ||
    `Order ${productName} printed in Canada. Durable vinyl banners for outdoor events, trade shows, and business signage. Fast nationwide shipping.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
}
