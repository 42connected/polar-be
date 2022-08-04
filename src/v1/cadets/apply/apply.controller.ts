import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { Roles } from 'src/v1/decorators/roles.decorator';
import { User } from 'src/v1/decorators/user.decorator';
import { jwtUser } from 'src/v1/dto/jwt-user.interface';
import { JwtGuard } from 'src/v1/guards/jwt.guard';
import { RolesGuard } from 'src/v1/guards/role.guard';
import { CreateApplyDto } from '../../dto/cadets/create-apply.dto';
import { ApplyService } from './apply.service';

@Controller()
export class ApplyController {
  constructor(private applyService: ApplyService) {}

  @Get()
  findAll() {
    return 'hi';
    //return this.applyService.findAll();
  }

  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @Post(':mentorId')
  create(
    @Param('mentorId') mentorId: string,
    @User() user: jwtUser,
    @Body() createApplyDto: CreateApplyDto,
  ) {
    return this.applyService.create(user, mentorId, createApplyDto);
  }
}
