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
import { CreateApplyDto } from '../dto/create-apply.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';

@Controller()
export class CadetsController {
  applyService: any;
  @Get('test')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  hello(@Req() req) {
    console.log('guard test', req.user);
    return 'hi';
  }

  @Post('applys/mentoring/:mentorId')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  create(
    @Param('mentorId') mentorId: string,
    @Req() req,
    @Body() createApplyDto: CreateApplyDto,
  ) {
    return this.applyService.create(req.user, mentorId, createApplyDto);
  }
}
