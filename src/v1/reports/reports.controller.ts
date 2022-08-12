import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { jwtUser } from '../interface/jwt-user.interface';
import { UpdateReportDto } from '../dto/reports/report.dto';
import { Reports } from '../entities/reports.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { ReportsService } from './service/reports.service';
import { PaginationDto } from '../dto/pagination.dto';

@Controller()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':reportId')
  @Roles('mentor', 'bocal')
  @UseGuards(JwtGuard, RolesGuard)
  async getReport(@Param('reportId') reportId: string): Promise<Reports> {
    return await this.reportsService.getReport(reportId);
  }

  @Get()
  @Roles('bocal')
  @UseGuards(JwtGuard, RolesGuard)
  async getReportPagination(@Query() paginationDto: PaginationDto) {
    return await this.reportsService.getReportPagination(paginationDto);
  }

  @Post(':mentoringLogId')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  async createReport(@Param('mentoringLogId') mentoringLogId: string) {
    return await this.reportsService.createReport(mentoringLogId);
  }

  @Patch(':reportId')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 5 },
        { name: 'signature', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
        }),
      },
    ),
  )
  async updateReport(
    @Param('reportId') reportId: string,
    @User() user: jwtUser,
    @Body() body: UpdateReportDto,
    @UploadedFiles()
    files: {
      image: Express.Multer.File[];
      signature: Express.Multer.File;
    },
  ) {
    const filePaths: string[] = this.reportsService.getImagesPath(files);
    const signaturePaths: string = this.reportsService.getSignaturePath(files);
    console.log(filePaths);
    console.log(signaturePaths);
    return await this.reportsService.updateReport(
      reportId,
      user.intraId,
      filePaths,
      signaturePaths,
      body,
    );
  }
}
