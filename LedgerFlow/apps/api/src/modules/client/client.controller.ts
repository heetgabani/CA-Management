import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientQueryDto } from './dto/client-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser, TenantId, Roles } from '../../common/decorators';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'clients', version: '1' })
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create new client' })
  create(
    @TenantId() tenantId: string,
    @CurrentUser('firmId') firmId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateClientDto,
  ) {
    return this.clientService.create(tenantId, firmId, userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all clients with pagination and filters' })
  findAll(@TenantId() tenantId: string, @Query() query: ClientQueryDto) {
    return this.clientService.findAll(tenantId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get client statistics' })
  getStats(@TenantId() tenantId: string) {
    return this.clientService.getStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client details' })
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.clientService.findOne(tenantId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client' })
  update(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientService.update(tenantId, id, userId, dto);
  }

  @Delete(':id')
  @Roles('FIRM_OWNER', 'PARTNER', 'MANAGER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Close client account' })
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.clientService.remove(tenantId, id);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get client activity timeline' })
  getTimeline(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.clientService.getTimeline(tenantId, id, page, limit);
  }
}
