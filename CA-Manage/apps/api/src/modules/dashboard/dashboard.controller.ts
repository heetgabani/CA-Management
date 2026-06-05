import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId, CurrentUser } from '../../common/decorators';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'dashboard', version: '1' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(@TenantId() tenantId: string, @CurrentUser() user: any) {
    return this.dashboardService.getStats(tenantId, user.firmId);
  }

  @Get('compliance-overview')
  getComplianceOverview(@TenantId() tenantId: string) {
    return this.dashboardService.getComplianceOverview(tenantId);
  }

  @Get('upcoming-compliances')
  getUpcomingCompliances(@TenantId() tenantId: string) {
    return this.dashboardService.getUpcomingCompliances(tenantId);
  }
}
