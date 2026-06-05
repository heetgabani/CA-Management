import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ComplianceService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    const { page = 1, limit = 20, status, type, clientId } = query;
    const skip = (page - 1) * limit;
    const where: any = { tenantId };
    if (status) where.status = status;
    if (type) where.type = type;
    if (clientId) where.clientId = clientId;
    const [items, total] = await Promise.all([
      this.prisma.compliance.findMany({ where, skip, take: +limit, include: { client: { select: { displayName: true, clientCode: true } } }, orderBy: { dueDate: 'asc' } }),
      this.prisma.compliance.count({ where }),
    ]);
    return { data: items, meta: { total, page: +page, limit: +limit } };
  }

  async findOne(tenantId: string, id: string) {
    const item = await this.prisma.compliance.findFirst({ where: { id, tenantId } });
    if (!item) throw new NotFoundException('Compliance record not found');
    return { data: item };
  }

  async create(tenantId: string, createdById: string, dto: any) {
    const item = await this.prisma.compliance.create({ data: { ...dto, tenantId, createdById } });
    return { data: item, message: 'Compliance record created' };
  }

  async update(tenantId: string, id: string, dto: any) {
    const item = await this.prisma.compliance.update({ where: { id }, data: dto });
    return { data: item, message: 'Compliance updated' };
  }

  async remove(tenantId: string, id: string) {
    await this.prisma.compliance.delete({ where: { id } });
    return { message: 'Compliance record deleted' };
  }
}
