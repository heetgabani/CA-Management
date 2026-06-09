import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantId } from '../../common/decorators';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'reports', version: '1' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  private sendCsv(res: Response, data: any[], filename: string) {
    const csv = this.reportsService.toCSV(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
    res.send(csv);
  }

  @Get('clients')
  async clients(@TenantId() tenantId: string, @Res() res: Response) {
    const data = await this.reportsService.getClientReport(tenantId);
    this.sendCsv(res, data, 'clients-report');
  }

  @Get('tasks')
  async tasks(@TenantId() tenantId: string, @Res() res: Response) {
    const data = await this.reportsService.getTaskReport(tenantId);
    this.sendCsv(res, data, 'tasks-report');
  }

  @Get('compliance')
  async compliance(@TenantId() tenantId: string, @Res() res: Response) {
    const data = await this.reportsService.getComplianceReport(tenantId);
    this.sendCsv(res, data, 'compliance-report');
  }

  @Get('storage')
  async storage(@TenantId() tenantId: string, @Res() res: Response) {
    const result = await this.reportsService.getStorageReport(tenantId);
    this.sendCsv(res, result.documents, 'storage-report');
  }

  @Get('staff')
  async staff(@TenantId() tenantId: string, @Res() res: Response) {
    const data = await this.reportsService.getStaffReport(tenantId);
    this.sendCsv(res, data, 'staff-report');
  }

  @Get('documents')
  async documents(@TenantId() tenantId: string, @Res() res: Response) {
    const result = await this.reportsService.getStorageReport(tenantId);
    this.sendCsv(res, result.documents, 'documents-report');
  }
}
