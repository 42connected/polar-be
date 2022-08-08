import { Controller, Get } from '@nestjs/common';
import { Keywords } from '../entities/keywords.entity';
import { SlackService } from '../slack/slack.service';
import { KeywordsService } from './service/keywords.service';

@Controller()
export class KeywordsController {
  constructor(
    private keywordsService: KeywordsService,
    private slackService: SlackService,
  ) {}

  @Get()
  getKeywords(): Promise<Keywords[]> {
    return this.keywordsService.getKeywords();
  }

  // 이건 나중에 지워야함!! slack api 테스트용
  @Get('/slack')
  getId() {
    return this.slackService.sendReservationMessage(
      'jeounpar',
      new Date('2022-08-08 13:30'),
      1,
      true,
    );
  }

  // @Post()
  // @Roles('mentor')
  // @UseGuards(JwtGuard, RolesGuard)
  // createKeyword(@Body() createKeywordDto: CreateKeywordDto): Promise<void> {
  //   const { name } = createKeywordDto;
  //   return this.keywordsService.createKeyword(name);
  // }

  // @Delete()
  // @Roles('mentor')
  // @UseGuards(JwtGuard, RolesGuard)
  // deleteKeyword(@Body() deleteKeywordDto: DeleteKeywordDto): Promise<void> {
  //   const { name } = deleteKeywordDto;
  //   return this.keywordsService.deleteKeyword(name);
  // }
}
