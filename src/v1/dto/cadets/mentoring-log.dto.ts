import { ApiProperty } from '@nestjs/swagger';

export class MentoringLogDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    description: '해당 멘토링을 진행한 멘토 정보',
    example: {
      intraId: 'nakkim',
      name: '김나경',
    },
  })
  mentor: {
    intraId: string;
    name: string;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({
    description: '멘토링의 현재 진행 상태',
    example: '예정',
  })
  status: string;

  @ApiProperty({
    description: '멘토링 제목/주제',
    example: '백엔드가 궁금',
  })
  topic: string;

  @ApiProperty({
    description: '해당 로그 클릭 시 띄울 로그에 대한 자세한 정보',
    example: {
      isCommon: true,
      content: '머시기가 궁금해요. 제가 똑바로 하고 있는 게 맞나요?',
      requestTime: [
        ['2022-08-18T10:00:00.000Z', '2022-08-18T11:30:00.000Z'],
        null,
        null,
      ],
      meetingAt: ['2022-08-18T10:00:00.000Z', '2022-08-18T11:30:00.000Z'],
      rejectMessage: null,
    },
  })
  meta: {
    isCommon: boolean;
    content: string;
    requestTime: Date[][];
    meetingAt: Date[];
    rejectMessage: string;
  };
}
