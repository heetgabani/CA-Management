import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ReminderService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.reminder.findMany({ where: { tenantId }, skip, take: +limit, orderBy: { dueDate: 'asc' } }),
      this.prisma.reminder.count({ where: { tenantId } }),
    ]);
    return { data: items, meta: { total, page: +page, limit: +limit } };
  }

  async create(tenantId: string, createdById: string, dto: any) {
    const item = await this.prisma.reminder.create({ data: { ...dto, tenantId, createdById } });
    return { data: item, message: 'Reminder created' };
  }

  async update(tenantId: string, id: string, dto: any) {
    const item = await this.prisma.reminder.update({ where: { id }, data: dto });
    return { data: item, message: 'Reminder updated' };
  }

  async remove(tenantId: string, id: string) {
    await this.prisma.reminder.delete({ where: { id } });
    return { message: 'Reminder deleted' };
  }
}
