import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AdminLoginDto } from './admin-auth.dto';
import { ADMIN_SESSION_COOKIE, AdminAuthService, getCookieValue } from './admin-auth.service';
import { AdminRequest, AdminSessionGuard } from './admin-session.guard';

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 12 * 60 * 60 * 1000,
  };
}

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly auth: AdminAuthService) {}

  @Post('login')
  async login(@Body() body: AdminLoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.login(body.email, body.password);
    response.cookie(ADMIN_SESSION_COOKIE, result.token, cookieOptions());
    return { admin: result.admin, expiresAt: result.expiresAt };
  }

  @UseGuards(AdminSessionGuard)
  @Get('me')
  me(@Req() request: AdminRequest) {
    return { admin: request.admin };
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    await this.auth.logout(getCookieValue(request.headers.cookie));
    response.clearCookie(ADMIN_SESSION_COOKIE, cookieOptions());
    return { success: true };
  }
}
