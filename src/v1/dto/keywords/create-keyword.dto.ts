import { ApiProperty } from '@nestjs/swagger';

export class CreateKeywordDto {
  @ApiProperty({
    description: 'name',
    required: true,
  })
  name: string;
}
