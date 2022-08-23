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
import { JwtUser } from '../interface/jwt-user.interface';
import { UpdateReportDto } from '../dto/reports/update-report.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { ReportsService } from './service/reports.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
import { ReportDto } from '../dto/reports/report.dto';
import { Reports } from '../entities/reports.entity';
config();

@Controller()
@ApiTags('reports API')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':reportId')
  @Roles('mentor', 'bocal')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get report information',
    description: '레포트의 모든 정보를 반환합니다.',
  })
  @ApiCreatedResponse({
    description: '레포트 정보',
    type: ReportDto,
  })
  async getReport(@Param('reportId') reportId: string): Promise<ReportDto> {
    return await this.reportsService.getReport(reportId);
  }

  @Post(':mentoringLogId')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads',
      }),
    }),
  )
  @ApiOperation({
    summary: 'Create report',
    description:
      '레포트 작성하기를 최초로 누르면 해당 멘토링 로그에 대한 레포트의 기본 정보가 DB에 생성된다.',
  })
  async createReport(
    @Param('mentoringLogId') mentoringLogId: string,
  ): Promise<boolean> {
    return await this.reportsService.createReport(mentoringLogId);
  }

  @Patch(':reportId')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 5 },
        { name: 'signature', maxCount: 1 },
      ],
      {
        storage: multerS3({
          s3: new AWS.S3({
            accessKeyId: process.env.AWS_S3_ID,
            secretAccessKey: process.env.AWS_S3_SECRET,
            signatureVersion: 'v4',
            region: 'ap-northeast-2',
          }),
          bucket: process.env.AWS_BUCKET_NAME,
          key: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
              cb(new Error('이미지만 업로드 가능합니다.'));
            } else {
              cb(null, `${Date.now()}_${file.originalname}`);
            }
          },
        }),
        limits: {
          fileSize: 3000000,
        },
      },
    ),
  )
  @ApiOperation({
    summary: 'Update report',
    description: '레포트 정보를 수정합니다.',
  })
  async updateReport(
    @Param('reportId') reportId: string,
    @User() user: JwtUser,
    @Body() body: UpdateReportDto,
    @UploadedFiles()
    files: {
      image: Express.Multer.File[];
      signature: Express.Multer.File;
    },
  ): Promise<boolean> {
    const filePaths: string[] = this.reportsService.getImagesPath(files);
    const signaturePaths: string = this.reportsService.getSignaturePath(files);
    const report: Reports =
      await this.reportsService.findReportWithMentoringLogsById(reportId);
    this.reportsService.deleteCurrentImages(report);
    return await this.reportsService.updateReport(
      report,
      user.intraId,
      filePaths,
      signaturePaths,
      body,
    );
  }
}
