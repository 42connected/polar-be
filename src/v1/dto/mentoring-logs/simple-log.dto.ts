import { ApiProperty } from '@nestjs/swagger';

export class SimpleLogDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    type: Date,
    example: '2022-08-22T09:52:24.969Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    isArray: true,
    example: ['2022-08-22T11:22:33.337Z', '2022-08-23T02:37:58.698Z'],
  })
  meetingAt: Date[];

  @ApiProperty({
    type: String,
    example: '취업',
  })
  topic: string;

  @ApiProperty({
    type: String,
    example: '완료',
  })
  status: string;
}
