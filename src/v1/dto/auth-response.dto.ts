import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    description: 'JWT',
  })
  jwt: string;

  @ApiProperty({
    description: '유저 정보',
    example: {
      intraId: 'nakkim',
      role: 'cadet',
      join: true,
    },
  })
  user: {
    intraId: string;
    role: string;
    join: boolean;
  };
}
