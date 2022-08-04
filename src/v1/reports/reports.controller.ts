import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ReportsService } from './service/reports.service';

@Controller()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':reportId')
  async getReport(@Param('reportId') reportId: string) {
    return await this.reportsService.getReport(reportId);
  }

  @Post()
  async postReport(@Body() req: any) {
    return await this.reportsService.postReport(req);
  }

  @Put()
  async putReport(@Body() req: any) {
    return await this.putReport(req);
  }
}
