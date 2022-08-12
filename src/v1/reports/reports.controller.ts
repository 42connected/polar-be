import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { jwtUser } from '../interface/jwt-user.interface';
import { CreateReportDto, UpdateReportDto } from '../dto/reports/report.dto';
import { Reports } from '../entities/reports.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { ReportsService } from './service/reports.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('reports API')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':reportId')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiOperation({
    summary: 'getReport API',
    description: 'Report 받아오는 api',
  })
  @ApiCreatedResponse({
    description: 'Report 정보 받아오기 성공',
    type: Promise<Reports>,
  })
  async getReport(@Param('reportId') reportId: string): Promise<Reports> {
    return await this.reportsService.getReport(reportId);
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
  @ApiOperation({
    summary: 'createReport API',
    description: 'Report 생성하는 api',
  })
  @ApiCreatedResponse({
    description: 'Report 생성 성공',
    type: Promise<string>,
  })
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

  @Patch(':reportId')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  @ApiOperation({
    summary: 'updateReport API',
    description: 'Report 수정하는 api',
  })
  @ApiCreatedResponse({
    description: 'Report 수정 성공',
    type: Promise<string>,
  })
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
}
