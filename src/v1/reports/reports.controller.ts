import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { jwtUser } from '../dto/jwt-user.interface';
import { CreateReportDto } from '../dto/reports/create-report.dto';
import { Reports } from '../entities/reports.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { ReportsService } from './service/reports.service';

@Controller()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':reportId')
  @Roles('mentor', 'cadet')
  @UseGuards(JwtGuard, RolesGuard)
  async getReport(@Param('reportId') reportId: string): Promise<Reports> {
    return await this.reportsService.getReport(reportId);
  }

  @Post()
  @Roles('cadet', 'mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  async postReport(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
    @User() user: jwtUser,
    @Body() body: CreateReportDto,
  ) {
    const filePaths: string[] = [];
    if (files) {
      files.image.map(img => {
        filePaths.push(img.path);
      });
    }
    return await this.reportsService.postReport(filePaths, user.intraId, body);
  }
}
