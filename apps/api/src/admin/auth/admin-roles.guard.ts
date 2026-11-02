import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '@prisma/client';
import { ADMIN_ROLES_KEY } from './admin-roles.decorator';
import { AdminRequest } from './admin-session.guard';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<AdminRole[]>(ADMIN_ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!roles?.length) return true;
    const request = context.switchToHttp().getRequest<AdminRequest>();
    if (!request.admin || !roles.includes(request.admin.role as AdminRole)) {
      throw new ForbiddenException('Your administrator role cannot access this section.');
    }
    return true;
  }
}
