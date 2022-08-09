import { Controller, Get } from '@nestjs/common';
import { Keywords } from '../entities/keywords.entity';
import { SlackService } from '../slack/service/slack.service';
import { KeywordsService } from './service/keywords.service';

@Controller()
export class KeywordsController {
  constructor(private keywordsService: KeywordsService) {}

  @Get()
  getKeywords(): Promise<Keywords[]> {
    return this.keywordsService.getKeywords();
  }

  // // 이건 나중에 지워야함!! slack api 테스트용
  // @Get('/slack')
  // sendReservationMessageToMentor() {
  //   const reservationdMessageDto: ReservationMessageDto = {
  //     mentorSlackId: 'jeounpar',
  //     cadetSlackId: 'jeounpar',
  //     reservationTime: new Date('2022-08-08 13:30'),
  //     mentoringTime: 1,
  //     isCommon: true,
  //   };
  //   return this.slackService.sendReservationMessageToMentor(
  //     reservationdMessageDto,
  //   );
  // }

  // // 이건 나중에 지워야함!! slack api 테스트용
  // @Get('/slack2')
  // sendApprovedMessageToCadet() {
  //   const approvedMessageDto: ApprovedMessageDto = {
  //     mentorSlackId: 'jeounpar',
  //     cadetSlackId: 'jeounpar',
  //     reservationTime: new Date('2022-08-08 13:30'),
  //     mentoringTime: 1,
  //   };
  //   return this.slackService.sendApprovedMessageToCadet(approvedMessageDto);
  // }

  // // 이건 나중에 지워야함!! slack api 테스트용
  // @Get('/slack3')
  // sendCanceldMessageToCadet() {
  //   const canceldMessageDto: CanceldMessageDto = {
  //     mentorSlackId: 'jeounpar',
  //     cadetSlackId: 'jeounpar',
  //   };
  //   return this.slackService.sendCanceldMessageToCadet(canceldMessageDto);
  // }

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
