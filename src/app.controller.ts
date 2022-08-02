import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { FortyTwoGuard } from './guards/forty-two.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(FortyTwoGuard)
  @Get('login')
  login() {
    return;
  }
}
