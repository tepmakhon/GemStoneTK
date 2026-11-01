import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { ListProductsQueryDto } from './dto/list-products-query.dto';

const productListSelect = {
  id: true,
  sku: true,
  status: true,
  pricingMethod: true,
  onHand: true,
  weightValue: true,
  weightUnit: true,
  color: true,
  dimensions: true,
  origin: true,
  naturalStatus: true,
  treatmentStatus: true,
  certification: true,
  unitPrice: true,
  currency: true,
  createdAt: true,
  translations: {
    where: { locale: { in: ['en', 'km'] } },
    select: { locale: true, name: true, description: true },
  },
  categories: {
    where: { category: { archivedAt: null } },
    select: {
      category: { select: { slug: true, nameEn: true, nameKm: true } },
    },
  },
  primaryMedia: { select: { id: true, mediaType: true, altEn: true, altKm: true } },
} satisfies Prisma.ProductSelect;

type ProductRecord = Prisma.ProductGetPayload<{ select: typeof productListSelect }>;

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async listProducts(query: ListProductsQueryDto) {
    const locale = query.locale ?? 'en';
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 24;
    const search = query.q?.trim();
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
      archivedAt: null,
      onHand: { gt: 0 },
      ...(search ? {
        OR: [
          { sku: { contains: search, mode: 'insensitive' } },
          { translations: { some: { locale, name: { contains: search, mode: 'insensitive' } } } },
        ],
      } : {}),
      ...(query.category ? {
        categories: { some: { category: { slug: query.category, archivedAt: null } } },
      } : {}),
    };
    const orderBy: Prisma.ProductOrderByWithRelationInput = query.sort === 'price_asc'
      ? { unitPrice: 'asc' }
      : query.sort === 'price_desc'
        ? { unitPrice: 'desc' }
        : { createdAt: 'desc' };

    const [records, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        select: productListSelect,
        orderBy: [orderBy, { id: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);
    const reserved = await this.reservedQuantityByProduct(records.map((product) => product.id));

    return {
      items: records.map((product) => this.toPublicProduct(product, locale, reserved.get(product.id) ?? 0)),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getProduct(sku: string, locale: 'en' | 'km' = 'en') {
    const product = await this.prisma.product.findFirst({
      where: { sku, status: 'ACTIVE', archivedAt: null },
      select: productListSelect,
    });
    if (!product) throw new NotFoundException('Product not found.');

    const reserved = await this.reservedQuantityByProduct([product.id]);
    return this.toPublicProduct(product, locale, reserved.get(product.id) ?? 0);
  }

  async listCategories(locale: 'en' | 'km' = 'en') {
    const categories = await this.prisma.category.findMany({
      where: {
        archivedAt: null,
        products: { some: { product: { status: 'ACTIVE', archivedAt: null, onHand: { gt: 0 } } } },
      },
      select: { slug: true, nameEn: true, nameKm: true },
      orderBy: [{ sortOrder: 'asc' }, { nameEn: 'asc' }],
    });
    return categories.map((category) => ({
      slug: category.slug,
      name: locale === 'km' ? (category.nameKm ?? category.nameEn) : category.nameEn,
    }));
  }

  private async reservedQuantityByProduct(productIds: string[]): Promise<Map<string, number>> {
    if (productIds.length === 0) return new Map();
    const grouped = await this.prisma.inventoryReservation.groupBy({
      by: ['productId'],
      where: { productId: { in: productIds }, status: 'ACTIVE', expiresAt: { gt: new Date() } },
      _sum: { quantity: true },
    });
    return new Map(grouped.map((entry) => [entry.productId, entry._sum.quantity ?? 0]));
  }

  private toPublicProduct(product: ProductRecord, locale: 'en' | 'km', reservedQuantity: number) {
    const translation = product.translations.find((entry) => entry.locale === locale)
      ?? product.translations.find((entry) => entry.locale === 'en')
      ?? product.translations[0];
    const availableQuantity = Math.max(0, product.onHand - reservedQuantity);

    return {
      id: product.id,
      sku: product.sku,
      name: translation?.name ?? product.sku,
      description: translation?.description ?? null,
      pricingMethod: product.pricingMethod,
      price: product.pricingMethod === 'FIXED' && product.unitPrice !== null
        ? product.unitPrice.toFixed(2)
        : null,
      currency: product.currency,
      availability: availableQuantity > 0 ? 'AVAILABLE' : product.onHand > 0 ? 'RESERVED' : 'UNAVAILABLE',
      availableQuantity,
      weight: product.weightValue?.toString() ?? null,
      weightUnit: product.weightUnit,
      color: product.color,
      dimensions: product.dimensions,
      origin: product.origin,
      naturalStatus: product.naturalStatus,
      treatmentStatus: product.treatmentStatus,
      certification: product.certification,
      categories: product.categories.map(({ category }) => ({
        slug: category.slug,
        name: locale === 'km' ? (category.nameKm ?? category.nameEn) : category.nameEn,
      })),
      primaryMedia: product.primaryMedia ? {
        mediaType: product.primaryMedia.mediaType,
        altText: locale === 'km' ? (product.primaryMedia.altKm ?? product.primaryMedia.altEn) : product.primaryMedia.altEn,
      } : null,
    };
  }
}
