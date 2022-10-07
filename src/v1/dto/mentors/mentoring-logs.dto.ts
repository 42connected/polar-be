import { ApiProperty } from '@nestjs/swagger';

export class MentoringLogsDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  meetingAt: Date[];

  @ApiProperty({
    example: {
      name: '김나경',
      intraId: 'nakkim',
      resumeUrl: 'https://asdf',
      isCommon: true,
    },
  })
  cadet: {
    name: string;
    intraId: string;
    resumeUrl: string;
    isCommon: boolean;
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
      id: 'uuid',
      status: '작성가능',
    },
  })
  report: {
    id: string;
    status: string;
  };

  @ApiProperty({
    example: {
      requestTime: [
        ['2022-08-12T08:00:00.000Z', '2022-08-12T10:00:00.000Z'],
        null,
        null,
      ],
      rejectMessage: null,
      content: '테스트중',
    },
  })
  meta: {
    requestTime: Date[][];
    rejectMessage: string;
    content: string;
  };
}
