import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AdminAuthService, getCookieValue } from './admin-auth.service';
import { AdminRole } from '@prisma/client';

export interface AdminRequest extends Request {
  admin?: { id: string; email: string; fullName: string; role: AdminRole };
  adminSessionToken?: string;
}

@Injectable()
export class AdminSessionGuard implements CanActivate {
  constructor(private readonly auth: AdminAuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AdminRequest>();
    const token = getCookieValue(request.headers.cookie);
    const session = await this.auth.getSession(token);
    if (!session) throw new UnauthorizedException('Administrator sign-in is required.');
    request.admin = session.admin;
    request.adminSessionToken = token;
    return true;
  }
}
