import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentQueryDto } from './dto/document-query.dto';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class DocumentService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  async upload(
    tenantId: string,
    clientId: string,
    userId: string,
    file: Express.Multer.File,
    dto: CreateDocumentDto,
  ) {
    const ext = path.extname(file.originalname).toLowerCase();
    const storageKey = `${tenantId}/${clientId}/${dto.category || 'other'}/${uuid()}${ext}`;

    const uploadResult = await this.storage.upload(file, storageKey);

    const document = await this.prisma.document.create({
      data: {
        tenantId,
        clientId,
        folderId: dto.folderId,
        uploadedById: userId,
        name: dto.name || file.originalname,
        originalName: file.originalname,
        description: dto.description,
        category: dto.category as any || 'OTHER',
        mimeType: file.mimetype,
        size: BigInt(file.size),
        extension: ext.replace('.', ''),
        storageKey,
        storageProvider: uploadResult.provider as any,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        financialYear: dto.financialYear,
        tags: dto.tags || [],
        remarks: dto.remarks,
      },
    });

    // Update storage usage
    await this.prisma.storageUsage.upsert({
      where: { tenantId_clientId_category: { tenantId, clientId, category: dto.category || 'OTHER' } },
      update: { usedBytes: { increment: BigInt(file.size) }, fileCount: { increment: 1 } },
      create: { tenantId, clientId, category: dto.category || 'OTHER', usedBytes: BigInt(file.size), fileCount: 1 },
    });

    // Log timeline
    await this.prisma.clientTimeline.create({
      data: {
        clientId,
        tenantId,
        userId,
        action: 'DOCUMENT_UPLOADED',
        description: `Document "${document.name}" was uploaded`,
        metadata: { documentId: document.id, category: dto.category },
      },
    });

    return { data: document, message: 'Document uploaded successfully' };
  }

  async findAll(tenantId: string, clientId: string, query: DocumentQueryDto) {
    const { page = 1, limit = 20, category, folderId, search } = query;

    const where: any = { tenantId, clientId, isLatest: true, deletedAt: null };
    if (category) where.category = category;
    if (folderId) where.folderId = folderId;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [total, docs] = await Promise.all([
      this.prisma.document.count({ where }),
      this.prisma.document.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { uploadedBy: { select: { firstName: true, lastName: true, avatarUrl: true } } },
      }),
    ]);

    return { data: docs, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getDownloadUrl(tenantId: string, documentId: string) {
    const doc = await this.prisma.document.findFirst({
      where: { id: documentId, tenantId, deletedAt: null },
    });
    if (!doc) throw new NotFoundException('Document not found');

    const url = await this.storage.getSignedUrl(doc.storageKey, 3600);
    return { data: { url, expiresIn: 3600 } };
  }

  async delete(tenantId: string, documentId: string, userId: string) {
    const doc = await this.prisma.document.findFirst({
      where: { id: documentId, tenantId, deletedAt: null },
    });
    if (!doc) throw new NotFoundException('Document not found');

    await this.prisma.document.update({
      where: { id: documentId },
      data: { deletedAt: new Date() },
    });

    await this.prisma.clientTimeline.create({
      data: {
        clientId: doc.clientId,
        tenantId,
        userId,
        action: 'DOCUMENT_DELETED',
        description: `Document "${doc.name}" was deleted`,
      },
    });

    return { message: 'Document deleted successfully' };
  }

  async getVersions(tenantId: string, documentId: string) {
    const versions = await this.prisma.documentVersion.findMany({
      where: { documentId, tenantId },
      orderBy: { version: 'desc' },
    });
    return { data: versions };
  }

  async createShare(tenantId: string, documentId: string, userId: string, expiresInHours = 24) {
    const doc = await this.prisma.document.findFirst({
      where: { id: documentId, tenantId },
    });
    if (!doc) throw new NotFoundException('Document not found');

    const token = uuid();
    const share = await this.prisma.fileShare.create({
      data: {
        tenantId,
        documentId,
        sharedByUserId: userId,
        token,
        expiresAt: new Date(Date.now() + expiresInHours * 60 * 60 * 1000),
      },
    });

    return { data: { shareToken: share.token, expiresAt: share.expiresAt } };
  }
}
