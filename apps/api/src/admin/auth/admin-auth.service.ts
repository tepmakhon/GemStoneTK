import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { compare } from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../../database/prisma.service';

export const ADMIN_SESSION_COOKIE = 'takeo_admin_session';
const SESSION_LIFETIME_MS = 12 * 60 * 60 * 1000;

export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function getCookieValue(cookieHeader: string | undefined, name = ADMIN_SESSION_COOKIE) {
  const prefix = `${name}=`;
  const entry = cookieHeader?.split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return entry?.slice(prefix.length);
}

@Injectable()
export class AdminAuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, password: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!admin || admin.disabledAt || !(await compare(password, admin.passwordHash))) {
      throw new UnauthorizedException('Email or password is incorrect.');
    }

    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS);
    await this.prisma.userSession.create({
      data: { tokenHash: hashSessionToken(token), adminUserId: admin.id, expiresAt },
    });
    return { token, expiresAt, admin: this.toSafeAdmin(admin) };
  }

  async getSession(token: string | undefined) {
    if (!token || token.length > 128) return null;
    const session = await this.prisma.userSession.findUnique({
      where: { tokenHash: hashSessionToken(token) },
      include: { adminUser: true },
    });
    if (!session || session.revokedAt || session.expiresAt <= new Date() || !session.adminUser || session.adminUser.disabledAt) {
      return null;
    }
    return { sessionId: session.id, admin: this.toSafeAdmin(session.adminUser) };
  }

  async logout(token: string | undefined) {
    if (!token || token.length > 128) return;
    await this.prisma.userSession.updateMany({
      where: { tokenHash: hashSessionToken(token), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private toSafeAdmin(admin: Prisma.AdminUserGetPayload<object>) {
    return { id: admin.id, email: admin.email, fullName: admin.fullName, role: admin.role };
  }
}
