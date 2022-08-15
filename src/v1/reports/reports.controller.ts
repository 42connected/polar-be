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
import { JwtUser } from '../interface/jwt-user.interface';
import { UpdateReportDto } from '../dto/reports/report.dto';
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
import { PaginationDto } from '../dto/pagination.dto';

@Controller()
@ApiTags('reports API')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':reportId')
  @Roles('mentor', 'bocal')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
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
  async createReport(@Param('mentoringLogId') mentoringLogId: string) {
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
        storage: diskStorage({
          destination: './uploads',
        }),
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
  ) {
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
