import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({
    description: '카테고리 이름',
    example: '개발',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: '카테고리에 해당하는 키워드 배열',
    type: String,
    isArray: true,
  })
  keywords: string[];
}
