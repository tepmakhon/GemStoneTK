export type CatalogCategory = { slug: string; name: string };

export type CatalogProduct = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  pricingMethod: 'FIXED' | 'NEGOTIABLE' | 'CONTACT';
  price: string | null;
  currency: string;
  availability: 'AVAILABLE' | 'RESERVED' | 'UNAVAILABLE';
  availableQuantity: number;
  weight: string | null;
  weightUnit: string | null;
  color: string | null;
  dimensions: string | null;
  origin: string | null;
  naturalStatus: string | null;
  treatmentStatus: string | null;
  certification: string | null;
  categories: CatalogCategory[];
  primaryMedia: { mediaType: string; altText: string | null } | null;
};

export type ProductPage = {
  items: CatalogProduct[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:4000/api/v1';

export async function fetchCategories(locale: 'en' | 'km'): Promise<CatalogCategory[]> {
  const response = await fetch(`${API_BASE}/categories?locale=${locale}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Category service returned an error.');
  return response.json();
}

export async function fetchProducts(params: URLSearchParams): Promise<ProductPage> {
  const response = await fetch(`${API_BASE}/products?${params.toString()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Catalog service returned an error.');
  return response.json();
}

export async function fetchProduct(sku: string, locale: 'en' | 'km'): Promise<CatalogProduct | null> {
  const response = await fetch(`${API_BASE}/products/${encodeURIComponent(sku)}?locale=${locale}`, { cache: 'no-store' });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Catalog service returned an error.');
  return response.json();
}
