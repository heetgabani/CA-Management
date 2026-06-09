import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId, Roles } from '../../common/decorators';

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'audit', version: '1' })
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('FIRM_OWNER', 'FIRM_ADMIN')
  findAll(@TenantId() tenantId: string, @Query() query: any) {
    return this.auditService.findAll(tenantId, query);
  }
}
