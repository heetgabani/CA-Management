import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientQueryDto } from './dto/client-query.dto';
import { ClientType, LeadSource } from '@prisma/client';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, firmId: string, userId: string, dto: CreateClientDto) {
    // Auto-generate client code
    const count = await this.prisma.client.count({ where: { tenantId } });
    const clientCode = dto.clientCode || `CLT-${String(count + 1).padStart(5, '0')}`;

    // Check uniqueness
    if (dto.pan) {
      const existing = await this.prisma.client.findFirst({ where: { tenantId, pan: dto.pan } });
      if (existing) throw new ConflictException(`Client with PAN ${dto.pan} already exists`);
    }

    const client = await this.prisma.client.create({
      data: {
        tenantId,
        firmId,
        clientCode,
        clientType: dto.clientType as ClientType,
        displayName: dto.displayName,
        firstName: dto.firstName,
        lastName: dto.lastName,
        tradeName: dto.tradeName,
        businessName: dto.businessName,
        primaryMobile: dto.primaryMobile,
        alternateMobile: dto.alternateMobile,
        primaryEmail: dto.primaryEmail,
        alternateEmail: dto.alternateEmail,
        pan: dto.pan,
        aadhaar: dto.aadhaar,
        gstin: dto.gstin,
        tan: dto.tan,
        cin: dto.cin,
        llpin: dto.llpin,
        iec: dto.iec,
        leadSource: dto.leadSource as LeadSource,
        assignedPartnerId: dto.assignedPartnerId,
        assignedAccountantId: dto.assignedAccountantId,
        incorporationDate: dto.incorporationDate,
        dateOfBirth: dto.dateOfBirth,
      },
    });

    // Create system document folders for this client
    const systemFolders = [
      { name: 'KYC', category: 'KYC' },
      { name: 'GST Documents', category: 'GST' },
      { name: 'Income Tax', category: 'INCOME_TAX' },
      { name: 'Audit', category: 'AUDIT' },
      { name: 'Bank Statements', category: 'BANK_STATEMENTS' },
      { name: 'Agreements', category: 'AGREEMENTS' },
      { name: 'Licenses', category: 'LICENSES' },
      { name: 'ROC Documents', category: 'ROC' },
      { name: 'DSC', category: 'DSC' },
      { name: 'TDS', category: 'TDS' },
      { name: 'Other', category: 'OTHER' },
    ];

    await this.prisma.documentFolder.createMany({
      data: systemFolders.map((f, i) => ({
        tenantId,
        clientId: client.id,
        name: f.name,
        isSystem: true,
        sortOrder: i,
      })),
    });

    // Log activity
    await this.prisma.clientTimeline.create({
      data: {
        clientId: client.id,
        tenantId,
        userId,
        action: 'CLIENT_CREATED',
        description: `Client ${client.displayName} was added`,
      },
    });

    return { data: client, message: 'Client created successfully' };
  }

  async findAll(tenantId: string, query: ClientQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      clientType,
      status,
      assignedPartnerId,
      assignedAccountantId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const where: any = { tenantId };

    if (search) {
      where.OR = [
        { displayName: { contains: search, mode: 'insensitive' } },
        { primaryMobile: { contains: search } },
        { primaryEmail: { contains: search, mode: 'insensitive' } },
        { pan: { contains: search, mode: 'insensitive' } },
        { gstin: { contains: search, mode: 'insensitive' } },
        { clientCode: { contains: search, mode: 'insensitive' } },
        { fileNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (clientType) where.clientType = clientType;
    if (status) where.status = status;
    if (assignedPartnerId) where.assignedPartnerId = assignedPartnerId;
    if (assignedAccountantId) where.assignedAccountantId = assignedAccountantId;

    const [total, clients] = await Promise.all([
      this.prisma.client.count({ where }),
      this.prisma.client.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          clientCode: true,
          fileNumber: true,
          displayName: true,
          clientType: true,
          primaryMobile: true,
          primaryEmail: true,
          pan: true,
          gstin: true,
          status: true,
          assignedPartnerId: true,
          assignedAccountantId: true,
          createdAt: true,
          _count: { select: { documents: true, tasks: true, compliances: true } },
        },
      }),
    ]);

    return {
      data: clients,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(tenantId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, tenantId },
      include: {
        addresses: true,
        contacts: true,
        _count: {
          select: {
            documents: true,
            tasks: { where: { status: { not: 'COMPLETED' } } },
            compliances: { where: { status: { not: 'APPROVED' } } },
            physicalFiles: true,
          },
        },
      },
    });

    if (!client) throw new NotFoundException('Client not found');
    return { data: client };
  }

  async update(tenantId: string, id: string, userId: string, dto: UpdateClientDto) {
    const client = await this.prisma.client.findFirst({ where: { id, tenantId } });
    if (!client) throw new NotFoundException('Client not found');

    const updated = await this.prisma.client.update({
      where: { id },
      data: dto as any,
    });

    await this.prisma.clientTimeline.create({
      data: {
        clientId: id,
        tenantId,
        userId,
        action: 'PROFILE_UPDATED',
        description: 'Client profile was updated',
      },
    });

    return { data: updated, message: 'Client updated successfully' };
  }

  async remove(tenantId: string, id: string) {
    const client = await this.prisma.client.findFirst({ where: { id, tenantId } });
    if (!client) throw new NotFoundException('Client not found');

    await this.prisma.client.update({
      where: { id },
      data: { status: 'CLOSED' },
    });

    return { message: 'Client closed successfully' };
  }

  async getTimeline(tenantId: string, clientId: string, page = 1, limit = 30) {
    const [total, timeline] = await Promise.all([
      this.prisma.clientTimeline.count({ where: { clientId, tenantId } }),
      this.prisma.clientTimeline.findMany({
        where: { clientId, tenantId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { data: timeline, meta: { total, page, limit } };
  }

  async getStats(tenantId: string) {
    const [total, active, inactive, clientsByType] = await Promise.all([
      this.prisma.client.count({ where: { tenantId } }),
      this.prisma.client.count({ where: { tenantId, status: 'ACTIVE' } }),
      this.prisma.client.count({ where: { tenantId, status: 'INACTIVE' } }),
      this.prisma.client.groupBy({
        by: ['clientType'],
        where: { tenantId },
        _count: { id: true },
      }),
    ]);

    return {
      data: {
        total,
        active,
        inactive,
        closed: total - active - inactive,
        byType: clientsByType.map((g) => ({ type: g.clientType, count: g._count.id })),
      },
    };
  }
}
