import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    const { page = 1, limit = 20, status, priority, assignedToId, clientId, search } = query;
    const skip = (page - 1) * limit;
    const where: any = { tenantId };
    if (status)       where.status     = status;
    if (priority)     where.priority   = priority;
    if (assignedToId) where.assigneeId = assignedToId;
    if (clientId)     where.clientId   = clientId;
    if (search)       where.title      = { contains: search, mode: 'insensitive' };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where, skip, take: +limit,
        include: {
          assignee: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          client:   { select: { id: true, displayName: true, clientCode: true } },
          _count:   { select: { comments: true, attachments: true } },
        },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.task.count({ where }),
    ]);
    return { data: tasks, meta: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) } };
  }

  async findOne(tenantId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, tenantId },
      include: {
        assignee:    { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        client:      { select: { id: true, displayName: true, clientCode: true } },
        createdBy:   { select: { id: true, firstName: true, lastName: true } },
        comments:    { orderBy: { createdAt: 'asc' } },
        attachments: true,
      },
    });
    if (!task) throw new NotFoundException('Task not found');

    // Enrich comments with user data manually
    const userIds = [...new Set(task.comments.map((c: any) => c.userId).filter(Boolean))];
    const users   = userIds.length
      ? await this.prisma.user.findMany({ where: { id: { in: userIds as string[] } }, select: { id: true, firstName: true, lastName: true, avatarUrl: true } })
      : [];
    const userMap = Object.fromEntries(users.map(u => [u.id, u]));

    return { ...task, comments: task.comments.map((c: any) => ({ ...c, user: userMap[c.userId] ?? null })) };
  }

  async create(tenantId: string, firmId: string, createdById: string, dto: any) {
    return this.prisma.task.create({
      data: { ...dto, tenantId, firmId, createdById },
      include: {
        assignee: { select: { id: true, firstName: true, lastName: true } },
        client:   { select: { id: true, displayName: true } },
      },
    });
  }

  async update(tenantId: string, id: string, userId: string, dto: any) {
    return this.prisma.task.update({ where: { id }, data: dto });
  }

  async remove(tenantId: string, id: string) {
    await this.prisma.task.delete({ where: { id } });
    return { message: 'Task deleted' };
  }

  async addComment(tenantId: string, taskId: string, userId: string, content: string) {
    return this.prisma.taskComment.create({ data: { taskId, tenantId, userId, content } });
  }

  async getStats(tenantId: string) {
    const [total, pending, inProgress, completed, overdue] = await Promise.all([
      this.prisma.task.count({ where: { tenantId } }),
      this.prisma.task.count({ where: { tenantId, status: 'PENDING' as any } }),
      this.prisma.task.count({ where: { tenantId, status: 'IN_PROGRESS' as any } }),
      this.prisma.task.count({ where: { tenantId, status: 'COMPLETED' as any } }),
      this.prisma.task.count({ where: { tenantId, status: { not: 'COMPLETED' as any }, dueDate: { lt: new Date() } } }),
    ]);
    return { data: { total, pending, inProgress, completed, overdue } };
  }
}
