import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { FortyTwoGuard } from 'src/guards/forty-two.guard';

@UseGuards(FortyTwoGuard)
@Controller('auth')
export class AuthController {
  @Get('/oauth/callback')
  callback(@Res() res: Response) {
    console.log('callback');
    res.redirect('/');
  }
}
