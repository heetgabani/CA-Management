import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId, CurrentUser } from '../../common/decorators';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'notifications', version: '1' })
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get() findAll(@TenantId() tenantId: string, @CurrentUser('id') userId: string, @Query() query: any) {
    return this.notificationService.findAll(tenantId, userId, query);
  }

  @Patch(':id/read') markRead(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.notificationService.markRead(tenantId, id);
  }

  @Patch('mark-all-read') markAllRead(@TenantId() tenantId: string, @CurrentUser('id') userId: string) {
    return this.notificationService.markAllRead(tenantId, userId);
  }
}
