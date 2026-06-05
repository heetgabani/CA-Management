import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getClientReport(tenantId: string) {
    return this.prisma.client.findMany({
      where: { tenantId },
      select: {
        clientCode: true, displayName: true, clientType: true, status: true,
        primaryEmail: true, primaryMobile: true, pan: true, gstin: true, createdAt: true,
      },
      orderBy: { displayName: 'asc' },
    });
  }

  async getTaskReport(tenantId: string) {
    return this.prisma.task.findMany({
      where: { tenantId },
      select: {
        title: true, status: true, priority: true, dueDate: true, createdAt: true,
        assignee: { select: { firstName: true, lastName: true } },
        client:   { select: { displayName: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getComplianceReport(tenantId: string) {
    return this.prisma.compliance.findMany({
      where: { tenantId },
      select: {
        title: true, type: true, status: true, dueDate: true, createdAt: true,
        client:     { select: { displayName: true } },
        assignee: { select: { firstName: true, lastName: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getStorageReport(tenantId: string) {
    const docs = await this.prisma.document.findMany({
      where: { tenantId },
      select: { originalName: true, size: true, category: true, createdAt: true, client: { select: { displayName: true } } },
    });
    const totalBytes = docs.reduce((s, d) => s + (Number(d.size ?? 0)), 0);
    return { documents: docs, totalBytes, totalMB: +(totalBytes / (1024 * 1024)).toFixed(2) };
  }

  async getStaffReport(tenantId: string) {
    const users = await this.prisma.user.findMany({
      where: { tenantId },
      select: { firstName: true, lastName: true, email: true, role: true, status: true, lastLoginAt: true },
    });
    const taskCounts = await this.prisma.task.groupBy({
      by: ['assigneeId'],
      where: { tenantId },
      _count: { id: true },
    });
    const map = Object.fromEntries(taskCounts.map(t => [t.assigneeId, t._count.id]));
    return users.map(u => ({ ...u, taskCount: map[(u as any).id] ?? 0 }));
  }

  toCSV(data: any[]): string {
    if (!data.length) return '';
    const flattenObj = (obj: any, prefix = ''): Record<string, any> => {
      return Object.entries(obj).reduce((acc, [k, v]) => {
        const key = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) {
          Object.assign(acc, flattenObj(v, key));
        } else {
          acc[key] = v instanceof Date ? v.toISOString() : v;
        }
        return acc;
      }, {} as Record<string, any>);
    };
    const flat = data.map(row => flattenObj(row));
    const headers = Object.keys(flat[0]);
    const rows = flat.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
    return [headers.join(','), ...rows].join('\n');
  }
}
