import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId, CurrentUser, Roles } from '../../common/decorators';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@TenantId() tenantId: string, @Query() query: any) {
    return this.userService.findAll(tenantId, query);
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.userService.findOne(tenantId, id);
  }

  @Patch(':id')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: any) {
    return this.userService.update(tenantId, id, dto);
  }

  @Patch(':id/deactivate')
  @Roles('FIRM_OWNER', 'FIRM_ADMIN')
  deactivate(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.userService.deactivate(tenantId, id);
  }

  @Post('invite')
  invite(@TenantId() tenantId: string, @CurrentUser() user: any, @Body() dto: { email: string; role: string }) {
    return this.userService.invite(tenantId, user.firmId, user.id, dto);
  }
}
