import { Controller, Get, UseGuards } from '@nestjs/common';
import { FortyTwoGuard } from './guards/forty-two.guard';

@Controller()
export class V1Controller {
  @UseGuards(FortyTwoGuard)
  @Get('login')
  login() {
    return;
  }
}
