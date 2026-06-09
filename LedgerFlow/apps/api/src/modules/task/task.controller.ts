import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId, CurrentUser } from '../../common/decorators';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'tasks', version: '1' })
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()       findAll(@TenantId() t: string, @Query() q: any) { return this.taskService.findAll(t, q); }
  @Get('stats') getStats(@TenantId() t: string) { return this.taskService.getStats(t); }
  @Get(':id')  findOne(@TenantId() t: string, @Param('id') id: string) { return this.taskService.findOne(t, id); }

  @Post()
  create(@TenantId() t: string, @CurrentUser() user: any, @Body() dto: any) {
    return this.taskService.create(t, user.firmId, user.id, dto);
  }

  @Patch(':id')
  update(@TenantId() t: string, @CurrentUser('id') uid: string, @Param('id') id: string, @Body() dto: any) {
    return this.taskService.update(t, id, uid, dto);
  }

  @Delete(':id')
  remove(@TenantId() t: string, @Param('id') id: string) { return this.taskService.remove(t, id); }

  @Post(':id/comments')
  addComment(@TenantId() t: string, @CurrentUser('id') uid: string, @Param('id') taskId: string, @Body() body: { content: string }) {
    return this.taskService.addComment(t, taskId, uid, body.content);
  }
}
