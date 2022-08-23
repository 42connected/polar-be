import { ApiProperty } from '@nestjs/swagger';

export class MentoringLogsDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  meetingAt: Date;

  @ApiProperty({
    example: {
      name: '김나경',
      intraId: 'nakkim',
      resumeUrl: 'https://asdf',
    },
  })
  cadet: {
    name: string;
    intraId: string;
    resumeUrl: string;
  };

  @ApiProperty({
    example: '뭐가 궁금합니다',
  })
  topic: string;

  @ApiProperty({
    example: '대기중',
  })
  status: string;

  @ApiProperty({
    example: {
      requestTime: [
        ['2022-08-12T08:00:00.000Z', '2022-08-12T10:00:00.000Z'],
        null,
        null,
      ],
      isCommon: true,
      rejectMessage: null,
      content: '테스트중',
    },
  })
  meta: {
    requestTime: Date[][2];
    isCommon: boolean;
    rejectMessage: string;
    content: string;
  };
}
