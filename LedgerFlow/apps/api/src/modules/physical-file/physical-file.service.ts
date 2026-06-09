import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class PhysicalFileService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    const { page = 1, limit = 20, status, clientId } = query;
    const skip = (page - 1) * limit;
    const where: any = { tenantId };
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    const [files, total] = await Promise.all([
      this.prisma.physicalFile.findMany({ where, skip, take: +limit, include: { client: { select: { displayName: true, clientCode: true } } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.physicalFile.count({ where }),
    ]);
    return { data: files, meta: { total, page: +page, limit: +limit } };
  }

  async findOne(tenantId: string, id: string) {
    const file = await this.prisma.physicalFile.findFirst({ where: { id, tenantId }, include: { movements: { orderBy: { createdAt: 'desc' } } } });
    if (!file) throw new NotFoundException('Physical file not found');
    return { data: file };
  }

  async create(tenantId: string, createdById: string, dto: any) {
    const file = await this.prisma.physicalFile.create({ data: { ...dto, tenantId, createdById } });
    return { data: file, message: 'Physical file registered' };
  }

  async update(tenantId: string, id: string, dto: any) {
    const file = await this.prisma.physicalFile.update({ where: { id }, data: dto });
    return { data: file, message: 'Physical file updated' };
  }

  async recordMovement(tenantId: string, fileId: string, movedById: string, dto: any) {
    const movement = await this.prisma.physicalFileMovement.create({ data: { ...dto, fileId, movedById } });
    await this.prisma.physicalFile.update({ where: { id: fileId }, data: { location: dto.toLocation } });
    return { data: movement, message: 'Movement recorded' };
  }
}
