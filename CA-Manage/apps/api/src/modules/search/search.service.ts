import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async globalSearch(tenantId: string, query: string, limit = 20) {
    if (!query || query.length < 2) return { data: { clients: [], documents: [], tasks: [], notes: [] } };

    const searchMode = { contains: query, mode: 'insensitive' as const };

    const [clients, documents, tasks, notes] = await Promise.all([
      this.prisma.client.findMany({
        where: {
          tenantId,
          OR: [
            { displayName: searchMode },
            { primaryMobile: { contains: query } },
            { primaryEmail: searchMode },
            { pan: searchMode },
            { gstin: searchMode },
            { clientCode: searchMode },
          ],
        },
        select: { id: true, displayName: true, clientCode: true, clientType: true, primaryMobile: true, pan: true },
        take: limit,
      }),
      this.prisma.document.findMany({
        where: { tenantId, name: searchMode, deletedAt: null },
        select: {
          id: true, name: true, category: true, clientId: true,
          client: { select: { displayName: true } },
        },
        take: limit,
      }),
      this.prisma.task.findMany({
        where: { tenantId, title: searchMode, status: { not: 'CANCELLED' } },
        select: { id: true, title: true, status: true, priority: true, dueDate: true },
        take: limit,
      }),
      this.prisma.note.findMany({
        where: { tenantId, content: searchMode, deletedAt: null },
        select: { id: true, title: true, content: true, clientId: true },
        take: limit,
      }),
    ]);

    return { data: { clients, documents, tasks, notes } };
  }
}
