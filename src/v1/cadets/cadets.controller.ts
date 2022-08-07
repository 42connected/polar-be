import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { CadetMentoringInfo } from '../dto/cadet-mentoring-info.interface';
import { CreateApplyDto } from '../dto/cadets/create-apply.dto';
import { jwtUser } from '../dto/jwt-user.interface';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { CadetsService } from './service/cadets.service';
import { ApplyService } from './apply/apply.service';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { Request } from 'express';

@Controller()
export class CadetsController {
  constructor(
    private cadetsService: CadetsService,
    private applyService: ApplyService,
  ) {}

  @Get('test')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  hello(@User() user: jwtUser) {
    console.log('guard test', user);
    return 'hi';
  }

  @Get('mentorings')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  async getMentoringLogs(@User() user: jwtUser): Promise<CadetMentoringInfo> {
    return await this.cadetsService.getMentoringLogs(user.id);
  }

  @Post('join')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  join(@Req() req: Request, @User() user: jwtUser) {
    const { name } = req.body;
    this.cadetsService.saveName(user, name);
  }

  @Post('mentorings/apply/:mentorId')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  create(
    @Param('mentorId') mentorId: string,
    @User() user: jwtUser,
    @Body() createApplyDto: CreateApplyDto,
  ): Promise<MentoringLogs> {
    return this.applyService.create(user, mentorId, createApplyDto);
  }
}
