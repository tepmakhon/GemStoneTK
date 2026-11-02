import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { AdminProductsQueryDto } from './admin-products-query.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const now = new Date();
    const [totalProducts, activeProducts, stock, reservations, totalOrders, pendingOrders, completedOrders, paymentTotal, recentActivity] = await Promise.all([
      this.prisma.product.count({ where: { archivedAt: null } }),
      this.prisma.product.count({ where: { status: 'ACTIVE', archivedAt: null } }),
      this.prisma.product.aggregate({ where: { status: 'ACTIVE', archivedAt: null }, _sum: { onHand: true } }),
      this.prisma.inventoryReservation.aggregate({ where: { status: 'ACTIVE', expiresAt: { gt: now }, product: { status: 'ACTIVE', archivedAt: null } }, _sum: { quantity: true } }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: { in: ['PENDING_PAYMENT', 'PAYMENT_REVIEW'] } } }),
      this.prisma.order.count({ where: { status: 'DELIVERED' } }),
      this.prisma.payment.count({ where: { status: 'VERIFIED' } }),
      this.prisma.auditLog.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { adminUser: { select: { fullName: true } } } }),
    ]);

    const onHand = stock._sum.onHand ?? 0;
    const reserved = reservations._sum.quantity ?? 0;
    return {
      products: { total: totalProducts, active: activeProducts, unitsOnHand: onHand, availableUnits: Math.max(0, onHand - reserved), reservedUnits: reserved },
      orders: { total: totalOrders, pending: pendingOrders, completed: completedOrders },
      payments: { verifiedCount: paymentTotal },
      recentActivity: recentActivity.map((activity) => ({
        id: activity.id,
        action: activity.action,
        entityType: activity.entityType,
        entityId: activity.entityId,
        actor: activity.adminUser?.fullName ?? 'Administrator',
        createdAt: activity.createdAt,
      })),
    };
  }

  async listProducts(query: AdminProductsQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 25;
    const search = query.q?.trim();
    const where: Prisma.ProductWhereInput = {
      ...(query.status === 'ARCHIVED' ? {} : { archivedAt: null }),
      ...(query.status ? { status: query.status } : {}),
      ...(search ? { OR: [
        { sku: { contains: search, mode: 'insensitive' } },
        { translations: { some: { name: { contains: search, mode: 'insensitive' } } } },
      ] } : {}),
    };
    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true, sku: true, status: true, pricingMethod: true, onHand: true, unitPrice: true, currency: true, updatedAt: true,
          translations: { where: { locale: 'en' }, select: { name: true }, take: 1 },
          categories: { select: { category: { select: { nameEn: true } } } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);
    const reserved = products.length ? await this.prisma.inventoryReservation.groupBy({
      by: ['productId'],
      where: { productId: { in: products.map((product) => product.id) }, status: 'ACTIVE', expiresAt: { gt: new Date() } },
      _sum: { quantity: true },
    }) : [];
    const reservedByProduct = new Map(reserved.map((row) => [row.productId, row._sum.quantity ?? 0]));
    return {
      items: products.map((product) => ({
        id: product.id,
        sku: product.sku,
        name: product.translations[0]?.name ?? 'Name not entered',
        status: product.status,
        pricingMethod: product.pricingMethod,
        price: product.unitPrice?.toFixed(2) ?? null,
        currency: product.currency,
        onHand: product.onHand,
        reserved: reservedByProduct.get(product.id) ?? 0,
        categories: product.categories.map(({ category }) => category.nameEn),
        updatedAt: product.updatedAt,
      })),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }
}
