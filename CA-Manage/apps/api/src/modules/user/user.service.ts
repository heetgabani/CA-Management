import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    const { page = 1, limit = 20, search, role } = query;
    const skip = (page - 1) * limit;
    const where: any = { tenantId };
    if (role) where.role = role;
    if (search) where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName:  { contains: search, mode: 'insensitive' } },
      { email:     { contains: search, mode: 'insensitive' } },
    ];
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where, skip, take: +limit,
        select: { id: true, firstName: true, lastName: true, email: true, role: true, status: true, avatarUrl: true, lastLoginAt: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { data: users, meta: { total, page: +page, limit: +limit } };
  }

  async findOne(tenantId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, status: true, avatarUrl: true, lastLoginAt: true, createdAt: true, phone: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return { data: user };
  }

  async update(tenantId: string, id: string, dto: any) {
    const { passwordHash, ...safe } = dto;
    const user = await this.prisma.user.update({ where: { id }, data: safe });
    return { data: user, message: 'User updated' };
  }

  async deactivate(tenantId: string, id: string) {
    await this.prisma.user.update({ where: { id }, data: { status: 'INACTIVE' as any } });
    return { message: 'User deactivated' };
  }

  async invite(tenantId: string, firmId: string, invitedById: string, dto: { email: string; role: string }) {
    const existing = await this.prisma.user.findFirst({ where: { tenantId, email: dto.email } });
    if (existing) throw new Error('A user with this email already exists in your firm');
    const user = await this.prisma.user.create({
      data: {
        tenantId,
        firmId,
        email: dto.email,
        role: dto.role as any,
        firstName: dto.email.split('@')[0],
        lastName: '',
        passwordHash: '',
        status: 'PENDING_VERIFICATION' as any,
      },
    });
    return { data: user, message: 'Invitation sent (email integration pending)' };
  }
}
