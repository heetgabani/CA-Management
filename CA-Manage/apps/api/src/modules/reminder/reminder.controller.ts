import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReminderService } from './reminder.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId, CurrentUser } from '../../common/decorators';

@ApiTags('Reminders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'reminders', version: '1' })
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get() findAll(@TenantId() tenantId: string, @Query() query: any) {
    return this.reminderService.findAll(tenantId, query);
  }

  @Post() create(@TenantId() tenantId: string, @CurrentUser('id') userId: string, @Body() dto: any) {
    return this.reminderService.create(tenantId, userId, dto);
  }

  @Patch(':id') update(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: any) {
    return this.reminderService.update(tenantId, id, dto);
  }

  @Delete(':id') remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.reminderService.remove(tenantId, id);
  }
}
