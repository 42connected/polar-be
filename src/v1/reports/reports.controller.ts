import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { jwtUser } from '../dto/jwt-user.interface';
import { CreateReportDto, UpdateReportDto } from '../dto/reports/report.dto';
import { ReportsSortDto } from '../dto/reports/reports-sort.dto';
import { Reports } from '../entities/reports.entity';
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

  @Post('sort')
  async sortReport(@Body() reportsSortDto: ReportsSortDto) {
    return await this.reportsService.sortReport(reportsSortDto);
  }

  @Post(':mentoringLogId')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  async createReport(
    @Param('mentoringLogId') mentoringLogId: string,
    @Body() body: CreateReportDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    const filePaths: string[] = this.reportsService.getFilePaths(files);
    return await this.reportsService.createReport(
      mentoringLogId,
      filePaths,
      body,
    );
  }

  @Put(':reportId')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  async updateReport(
    @Param('reportId') reportId: string,
    @User() user: jwtUser,
    @Body() body: UpdateReportDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    const filePaths: string[] = this.reportsService.getFilePaths(files);
    return await this.reportsService.updateReport(
      reportId,
      user.intraId,
      filePaths,
      body,
    );
  }

  @Get()
  // @Roles('')
  // FIXME: add to "bocal"
  // @UseGuards(JwtGuard, RolesGuard)
  async getAllReport() {
    return await this.reportsService.getAllReport();
  }
}
