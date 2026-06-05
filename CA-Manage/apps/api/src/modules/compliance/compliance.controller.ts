import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId, CurrentUser } from '../../common/decorators';

@ApiTags('Compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'compliance', version: '1' })
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get() findAll(@TenantId() tenantId: string, @Query() query: any) {
    return this.complianceService.findAll(tenantId, query);
  }

  @Get(':id') findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.complianceService.findOne(tenantId, id);
  }

  @Post() create(@TenantId() tenantId: string, @CurrentUser('id') userId: string, @Body() dto: any) {
    return this.complianceService.create(tenantId, userId, dto);
  }

  @Patch(':id') update(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: any) {
    return this.complianceService.update(tenantId, id, dto);
  }

  @Delete(':id') remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.complianceService.remove(tenantId, id);
  }
}
