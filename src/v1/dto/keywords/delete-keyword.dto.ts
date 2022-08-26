import { ApiProperty } from '@nestjs/swagger';

export class DeleteKeywordDto {
  @ApiProperty({
    description: 'name',
    required: true,
  })
  name: string;
}
