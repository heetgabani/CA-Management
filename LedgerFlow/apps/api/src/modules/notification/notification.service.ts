import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, userId: string, query: any) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({ where: { tenantId, userId }, skip, take: +limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.notification.count({ where: { tenantId, userId } }),
    ]);
    return { data: notifications, meta: { total, page: +page, limit: +limit } };
  }

  async markRead(tenantId: string, id: string) {
    await this.prisma.notification.update({ where: { id }, data: { isRead: true, readAt: new Date() } });
    return { message: 'Notification marked as read' };
  }

  async markAllRead(tenantId: string, userId: string) {
    await this.prisma.notification.updateMany({ where: { tenantId, userId, isRead: false }, data: { isRead: true, readAt: new Date() } });
    return { message: 'All notifications marked as read' };
  }
}
