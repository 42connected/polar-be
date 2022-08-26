import { ApiProperty } from '@nestjs/swagger';

export class MentorDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    example: 'nakkim',
  })
  intraId: string;

  @ApiProperty({
    example: 'nakkim',
  })
  slackId?: string;

  @ApiProperty({
    description: '본명',
    example: '김나경',
  })
  name?: string;

  @ApiProperty({
    example: 'test@gmail.com',
  })
  email?: string;

  @ApiProperty({
    description: '재직 중인 회사',
    example: '애플',
  })
  company?: string;

  @ApiProperty({
    description: '회사에서의 직급',
    example: 'CTO',
  })
  duty?: string;

  @ApiProperty({
    description: '프로필 이미지 링크',
  })
  profileImage?: string;

  @ApiProperty({
    description: '멘토링 가능 시간',
    example:
      '[[],[{"startHour":6,"startMinute":0,"endHour":10,"endMinute":0},{"startHour":10,"startMinute":0,"endHour":11,"endMinute":0}],[],[],[{"startHour":6,"startMinute":30,"endHour":9,"endMinute":0}],[],[{"startHour":6,"startMinute":30,"endHour":9,"endMinute":0}]]',
  })
  availableTime?: string;

  @ApiProperty({
    description: '간단한 자기소개',
    example: '안녕하세요 개발중입니다.',
  })
  introduction?: string;

  @ApiProperty()
  tags?: string[];

  @ApiProperty({
    description: '멘토링 가능 상태',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: '마크다운으로 작성한 자기 소개',
    example: '<h1>안녕하세요 마크다운입니다.</h1>',
  })
  markdownContent?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
