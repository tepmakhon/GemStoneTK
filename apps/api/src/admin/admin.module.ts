import { Module } from '@nestjs/common';
import { AdminAuthController } from './auth/admin-auth.controller';
import { AdminAuthService } from './auth/admin-auth.service';
import { AdminSessionGuard } from './auth/admin-session.guard';
import { AdminRolesGuard } from './auth/admin-roles.guard';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminAuthController, AdminController],
  providers: [AdminAuthService, AdminService, AdminSessionGuard, AdminRolesGuard],
})
export class AdminModule {}
