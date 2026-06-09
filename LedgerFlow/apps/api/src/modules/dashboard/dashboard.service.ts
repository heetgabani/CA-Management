import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tenantId: string, firmId: string) {
    const now     = new Date();
    const in7days = new Date(Date.now() + 7 * 86400000);
    const in30days= new Date(Date.now() + 30 * 86400000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalClients, activeClients,
      pendingTasks, overdueTasks, completedTasksMonth,
      dueSoonCompliances, overdueCompliances,
      totalDocuments, storageResult,
      totalStaff,
      recentActivities,
    ] = await Promise.all([
      this.prisma.client.count({ where: { tenantId } }),
      this.prisma.client.count({ where: { tenantId, status: 'ACTIVE' as any } }),
      this.prisma.task.count({ where: { tenantId, status: { in: ['PENDING', 'IN_PROGRESS'] as any[] } } }),
      this.prisma.task.count({ where: { tenantId, status: { not: 'COMPLETED' as any }, dueDate: { lt: now } } }),
      this.prisma.task.count({ where: { tenantId, status: 'COMPLETED' as any, updatedAt: { gte: startOfMonth } } }),
      this.prisma.compliance.count({ where: { tenantId, status: { not: 'COMPLETED' as any }, dueDate: { gte: now, lte: in7days } } }),
      this.prisma.compliance.count({ where: { tenantId, status: { not: 'COMPLETED' as any }, dueDate: { lt: now } } }),
      this.prisma.document.count({ where: { tenantId } }),
      this.prisma.document.aggregate({ where: { tenantId }, _sum: { size: true } }),
      this.prisma.user.count({ where: { tenantId, status: 'ACTIVE' as any } }),
      this.prisma.activity.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } } }),
    ]);

    const tasksByStatus = await this.prisma.task.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: { id: true },
    });

    return {
      totalClients,
      activeClients,
      pendingTasks,
      overdueTasks,
      completedTasksMonth,
      dueSoonCompliances,
      overdueCompliances,
      totalDocuments,
      storageUsedBytes: Number(storageResult._sum.size ?? 0),
      storageUsedMB: +(Number(storageResult._sum.size ?? 0) / (1024 * 1024)).toFixed(2),
      totalStaff,
      tasksByStatus: tasksByStatus.map(t => ({ status: t.status, count: t._count.id })),
      recentActivities,
    };
  }

  async getComplianceOverview(tenantId: string) {
    const now      = new Date();
    const in7days  = new Date(Date.now() + 7 * 86400000);
    const in30days = new Date(Date.now() + 30 * 86400000);

    const [overdue, dueSoon, dueThisMonth, completed, byType] = await Promise.all([
      this.prisma.compliance.findMany({
        where: { tenantId, status: { not: 'COMPLETED' as any }, dueDate: { lt: now } },
        include: { client: { select: { displayName: true } } },
        orderBy: { dueDate: 'asc' },
        take: 10,
      }),
      this.prisma.compliance.findMany({
        where: { tenantId, status: { not: 'COMPLETED' as any }, dueDate: { gte: now, lte: in7days } },
        include: { client: { select: { displayName: true } } },
        orderBy: { dueDate: 'asc' },
        take: 10,
      }),
      this.prisma.compliance.count({ where: { tenantId, dueDate: { gte: now, lte: in30days } } }),
      this.prisma.compliance.count({ where: { tenantId, status: 'COMPLETED' as any } }),
      this.prisma.compliance.groupBy({ by: ['type'], where: { tenantId }, _count: { id: true } }),
    ]);

    return { overdue, dueSoon, dueThisMonth, completed, byType: byType.map(t => ({ type: t.type, count: t._count.id })) };
  }

  async getUpcomingCompliances(tenantId: string) {
    return this.prisma.compliance.findMany({
      where: { tenantId, status: { not: 'COMPLETED' as any }, dueDate: { gte: new Date(), lte: new Date(Date.now() + 30 * 86400000) } },
      include: { client: { select: { displayName: true } } },
      orderBy: { dueDate: 'asc' },
      take: 15,
    });
  }
}
