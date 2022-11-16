import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
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
  ApiResponse,
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

  @Get('history/:reportId')
  @Roles('bocal')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get report history',
    description: '레포트의 모든 히스토리를 반환합니다.',
  })
  async getReportHistory(
    @Param('reportId') reportId: string,
  ): Promise<ReportDto[]> {
    return await this.reportsService.getReportHistory(reportId);
  }

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
    return await this.reportsService.findReportById(reportId);
  }

  @Delete(':reportId/picture')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete report picture',
    description: `레포트의 사진(서명, 증빙사진)을 삭제합니다.
    서명(signature)은 값으로 아무거나 넣으면 되고, 증빙사진(image)는 인덱스(0 or 1)로 삭제 가능합니다.`,
  })
  async deletePicture(
    @Param('reportId') reportId: string,
    @User() user: JwtUser,
    @Query('signature') signature: string,
    @Query('image') image: number,
  ) {
    const report: Reports = await this.reportsService.findReportByIdWithAllInfo(
      reportId,
    );
    if (report.mentors.intraId !== user.intraId) {
      throw new ForbiddenException('레포트 수정 권한이 없습니다.');
    }
    return this.reportsService.deletePicture(report, { signature, image });
  }

  @Patch(':reportId/picture')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update report picture',
    description: `레포트에 사진(서명, 증빙사진)을 업로드합니다.
    증빙사진의 경우 image로, 서명은 signature로 폼 요청`,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
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
  async updatePicture(
    @Param('reportId') reportId: string,
    @User() user: JwtUser,
    @UploadedFiles()
    files: {
      image: Express.Multer.File;
      signature: Express.Multer.File;
    },
  ): Promise<boolean> {
    const report: Reports = await this.reportsService.findReportByIdWithAllInfo(
      reportId,
    );
    if (report.mentors.intraId !== user.intraId) {
      throw new ForbiddenException('레포트 수정 권한이 없습니다.');
    }
    if (files?.signature) {
      const signatureKey: string = files.signature[0].key;
      await this.reportsService.uploadSignature(report, signatureKey);
    }
    if (files?.image) {
      const imageKey: string = files.image[0].key;
      await this.reportsService.uploadImage(report, imageKey);
    }
    return true;
  }

  @Post(':mentoringLogId')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create report',
    description:
      '레포트 작성하기를 최초로 누르면 해당 멘토링 로그에 대한 레포트의 기본 정보가 DB에 생성된다.',
  })
  @ApiCreatedResponse({
    description: '생성된 레포트 아이디',
    type: String,
  })
  async createReport(
    @Param('mentoringLogId') mentoringLogId: string,
  ): Promise<string> {
    return await this.reportsService.createReport(mentoringLogId);
  }

  @Patch(':reportId')
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update report',
    description: '레포트 정보를 수정합니다.',
  })
  async updateReport(
    @Param('reportId') reportId: string,
    @User() user: JwtUser,
    @Body() body: UpdateReportDto,
  ): Promise<boolean> {
    const report: Reports =
      await this.reportsService.findReportWithMentoringLogsById(reportId);
    if (report.mentors.intraId !== user.intraId) {
      throw new ForbiddenException(
        '해당 레포트를 수정할 수 있는 권한이 없습니다',
      );
    }
    return await this.reportsService.updateReport(report, body);
  }

  @Patch(':reportId/edit')
  @Roles('bocal')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'switchTempEdit',
    description: '레포트 임시 수정 상태를 가능 또는 불가능으로 변경',
  })
  @ApiResponse({
    description: '현재 tempEdit 컬럼의 상태를 리턴',
  })
  async switchTempEdit(@Param('reportId') reportId: string): Promise<boolean> {
    try {
      const report: Reports =
        await this.reportsService.findReportWithMentoringLogsById(reportId);
      return await this.reportsService.switchTempEdit(report);
    } catch {
      throw new ConflictException(
        `[ERROR]: 레포트 임시 수정 권한 변경 중 예기치 못한 에러가 발생하였습니다.`,
      );
    }
  }

  /**
   * URL 예시) /api/v1/reports/edit/true?from=2022-10-01&to=2022-11-20
   * @param isTempEdit 변경하고자 하는 상태
   * @param date ?from=""&to="" 변경하고자 하는 기간의 범위
   * @returns 성공시 true
   */
  @Patch('edit/:bool')
  @Roles('bocal')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    description:
      'from부터 to까지 기간에 생성된 레포트 임시 수정 상태를 가능 또는 불가능으로 변경',
  })
  @ApiResponse({
    description: '성공시 true',
  })
  async changeTempEditByDate(
    @Param('bool') isTempEdit: boolean,
    @Query() date: { from: string; to: string },
  ): Promise<boolean> {
    try {
      return await this.reportsService.changeTempEditByDate(
        isTempEdit,
        date.from,
        date.to,
      );
    } catch {
      throw new ConflictException(
        `[ERROR]: 범위 레포트 임시 수정 권한 변경 중 예기치 못한 에러가 발생하였습니다.`,
      );
    }
  }
}
