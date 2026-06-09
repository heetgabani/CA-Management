import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class FirmService {
  constructor(private prisma: PrismaService) {}

  async getFirm(tenantId: string, firmId: string) {
    const firm = await this.prisma.firm.findFirst({
      where: { id: firmId, tenantId },
      include: { addresses: true, branches: { where: { isActive: true } } },
    });
    if (!firm) throw new NotFoundException('Firm not found');
    return { data: firm };
  }

  async update(tenantId: string, firmId: string, dto: any) {
    const firm = await this.prisma.firm.update({ where: { id: firmId }, data: dto });
    return { data: firm, message: 'Firm updated' };
  }
}
