import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    const { page = 1, limit = 50, action, userId } = query;
    const skip = (page - 1) * limit;
    const where: any = { tenantId };
    if (action) where.action = action;
    if (userId) where.userId = userId;
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({ where, skip, take: +limit, include: { user: { select: { firstName: true, lastName: true, email: true } } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { data: logs, meta: { total, page: +page, limit: +limit } };
  }
}
