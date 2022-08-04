import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { RolesGuard } from 'src/v1/guards/role.guard';
import { CreateApplyDto } from '../dto/create-apply.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { ApplyService } from './applys.service';

@Controller()
export class ApplyController {
  constructor(private applyService: ApplyService) {}

  @Get()
  findAll() {
    return 'hi';
    //return this.applyService.findAll();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Post(':mentorId')
  create(
    @Param('mentorId') mentorId: string,
    @Req() req,
    @Body() createApplyDto: CreateApplyDto,
  ) {
    return this.applyService.create(req.user, mentorId, createApplyDto);
  }
}
