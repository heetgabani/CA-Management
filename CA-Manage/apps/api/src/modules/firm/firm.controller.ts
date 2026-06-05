import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FirmService } from './firm.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId, CurrentUser, Roles } from '../../common/decorators';

@ApiTags('Firm')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'firm', version: '1' })
export class FirmController {
  constructor(private readonly firmService: FirmService) {}

  @Get() getFirm(@TenantId() tenantId: string, @CurrentUser('firmId') firmId: string) {
    return this.firmService.getFirm(tenantId, firmId);
  }

  @Patch()
  @Roles('FIRM_OWNER')
  update(@TenantId() tenantId: string, @CurrentUser('firmId') firmId: string, @Body() dto: any) {
    return this.firmService.update(tenantId, firmId, dto);
  }
}
