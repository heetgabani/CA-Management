import {
  Controller, Get, Post, Delete, Param, Query, Body,
  UploadedFile, UploadedFiles, UseInterceptors, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentQueryDto } from './dto/document-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, TenantId } from '../../common/decorators';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'clients/:clientId/documents', version: '1' })
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a document to client locker' })
  upload(
    @TenantId() tenantId: string,
    @Param('clientId') clientId: string,
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.documentService.upload(tenantId, clientId, userId, file, dto);
  }

  @Post('bulk-upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 20))
  @ApiOperation({ summary: 'Bulk upload documents' })
  bulkUpload(
    @TenantId() tenantId: string,
    @Param('clientId') clientId: string,
    @CurrentUser('id') userId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateDocumentDto,
  ) {
    return Promise.all(files.map((f) => this.documentService.upload(tenantId, clientId, userId, f, dto)));
  }

  @Get()
  @ApiOperation({ summary: 'List client documents' })
  findAll(
    @TenantId() tenantId: string,
    @Param('clientId') clientId: string,
    @Query() query: DocumentQueryDto,
  ) {
    return this.documentService.findAll(tenantId, clientId, query);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get signed download URL' })
  getDownloadUrl(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.documentService.getDownloadUrl(tenantId, id);
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Get document version history' })
  getVersions(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.documentService.getVersions(tenantId, id);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Create shareable link' })
  createShare(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() body: { expiresInHours?: number },
  ) {
    return this.documentService.createShare(tenantId, id, userId, body.expiresInHours);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete document' })
  remove(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.documentService.delete(tenantId, id, userId);
  }
}
