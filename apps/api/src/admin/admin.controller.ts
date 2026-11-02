import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
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
}
