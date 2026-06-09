import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PhysicalFileService } from './physical-file.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId, CurrentUser } from '../../common/decorators';

@ApiTags('Physical Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'physical-files', version: '1' })
export class PhysicalFileController {
  constructor(private readonly physicalFileService: PhysicalFileService) {}

  @Get() findAll(@TenantId() tenantId: string, @Query() query: any) {
    return this.physicalFileService.findAll(tenantId, query);
  }

  @Get(':id') findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.physicalFileService.findOne(tenantId, id);
  }

  @Post() create(@TenantId() tenantId: string, @CurrentUser('id') userId: string, @Body() dto: any) {
    return this.physicalFileService.create(tenantId, userId, dto);
  }

  @Patch(':id') update(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: any) {
    return this.physicalFileService.update(tenantId, id, dto);
  }

  @Post(':id/movement') recordMovement(@TenantId() tenantId: string, @CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: any) {
    return this.physicalFileService.recordMovement(tenantId, id, userId, dto);
  }
}
