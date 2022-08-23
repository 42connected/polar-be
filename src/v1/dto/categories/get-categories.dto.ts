import { ApiProperty } from '@nestjs/swagger';

export class GetCategoriesDto {
  @ApiProperty({
    description: '카테고리 이름',
    example: '취업',
    type: String,
  })
  name: string;
}
