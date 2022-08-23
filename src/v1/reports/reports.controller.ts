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
import { Reports } from '../entities/reports.entity';
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
    type: Promise<Reports>,
  })
  async getReport(@Param('reportId') reportId: string): Promise<Reports> {
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
    summary: 'createReport API',
    description: 'Report 생성하는 api',
  })
  @ApiCreatedResponse({
    description: 'Report 생성 성공',
    type: Promise<string>,
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
    summary: 'updateReport API',
    description: 'Report 수정하는 api',
  })
  @ApiCreatedResponse({
    description: 'Report 수정 성공',
    type: Promise<string>,
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
    return await this.reportsService.updateReport(
      reportId,
      user.intraId,
      filePaths,
      signaturePaths,
      body,
    );
  }
}
