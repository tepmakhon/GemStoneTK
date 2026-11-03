import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { AdminRequest } from './auth/admin-session.guard';
import { InventoryAdjustmentDto, InventoryMovementsQueryDto, ShopSaleDto } from './inventory.dto';
import { AdminProductsQueryDto } from './admin-products-query.dto';
import { AdminService } from './admin.service';
import { AdminSessionGuard } from './auth/admin-session.guard';
import { AdminRoles } from './auth/admin-roles.decorator';
import { AdminRolesGuard } from './auth/admin-roles.guard';

@UseGuards(AdminSessionGuard, AdminRolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('overview')
  @AdminRoles(AdminRole.OWNER, AdminRole.MANAGER, AdminRole.REPORT_VIEWER)
  overview() {
    return this.admin.getOverview();
  }

  @Get('products')
  @AdminRoles(AdminRole.OWNER, AdminRole.MANAGER, AdminRole.CATALOG_EDITOR, AdminRole.INVENTORY_CLERK, AdminRole.REPORT_VIEWER)
  products(@Query() query: AdminProductsQueryDto) {
    return this.admin.listProducts(query);
  }

  @Get('inventory/movements')
  @AdminRoles(AdminRole.OWNER, AdminRole.MANAGER, AdminRole.INVENTORY_CLERK, AdminRole.REPORT_VIEWER)
  inventoryMovements(@Query() query: InventoryMovementsQueryDto) {
    return this.admin.listInventoryMovements(query);
  }

  @Get('products/:id/inventory-movements')
  @AdminRoles(AdminRole.OWNER, AdminRole.MANAGER, AdminRole.INVENTORY_CLERK, AdminRole.REPORT_VIEWER)
  productInventoryMovements(@Param('id') id: string, @Query() query: InventoryMovementsQueryDto) {
    return this.admin.listInventoryMovements(query, id);
  }

  @Post('products/:id/inventory-adjustments')
  @AdminRoles(AdminRole.OWNER, AdminRole.MANAGER, AdminRole.INVENTORY_CLERK)
  adjustInventory(@Req() request: AdminRequest, @Param('id') id: string, @Body() body: InventoryAdjustmentDto) {
    return this.admin.adjustInventory(request.admin!.id, id, body);
  }

  @Post('products/:id/shop-sales')
  @AdminRoles(AdminRole.OWNER, AdminRole.MANAGER, AdminRole.INVENTORY_CLERK)
  recordShopSale(@Req() request: AdminRequest, @Param('id') id: string, @Body() body: ShopSaleDto) {
    return this.admin.recordShopSale(request.admin!.id, id, body);
  }
}
