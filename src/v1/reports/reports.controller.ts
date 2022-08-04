<<<<<<< HEAD
import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { ReportsSortDto } from '../dto/reports/reports-sort.dto';
=======
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { jwtUser } from '../dto/jwt-user.interface';
import {
  CreateReportDto,
  UpdateReportDto,
} from '../dto/reports/create-report.dto';
import { Reports } from '../entities/reports.entity';
>>>>>>> a3a8f46727b6d02d5c4e9cc989e13edf17ded345
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { ReportsService } from './service/reports.service';

@Controller()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':reportId')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  async getReport(@Param('reportId') reportId: string): Promise<Reports> {
    return await this.reportsService.getReport(reportId);
  }

  @Post()
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  async postReport(@User() user: jwtUser, @Body() body: CreateReportDto) {
    return await this.reportsService.postReport(user.intraId, body);
  }

  @Put(':reportId')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  async putReport(
    @User() user: jwtUser,
    @Param('reportId') reportId: string,
    @Body() body: UpdateReportDto,
  ) {
    return await this.reportsService.putReport(user.intraId, reportId, body);
  }

  @Get()
  // @Roles('')
  // FIXME: add to "bocal"
  // @UseGuards(JwtGuard, RolesGuard)
  async getAllReport() {
    console.log('here');
    return await this.reportsService.getAllReport();
  }

  @Post('/sort')
  async sortReport(@Body() reportsSortDto: ReportsSortDto) {
    return await this.reportsService.sortReport(reportsSortDto);
  }
}
