import { ApiProperty } from '@nestjs/swagger';
import { Categories } from 'src/v1/entities/categories.entity';
import { MentorsListElement } from 'src/v1/interface/mentors/mentors-list-element.interface';

export class MentorsListDto {
  @ApiProperty({
    description: '카테고리 정보',
    examples: {
      id: 'bf0e98ef-2e1c-4155-a81f-0a948838c67f',
      name: '취업',
    },
  })
  category: Categories;

  @ApiProperty({
    description: '카테고리에 해당하는 멘토 수',
    example: 31,
  })
  mentorCount: number;

  @ApiProperty({
    description: '멘토 정보와 해당 멘토가 포함하는 키워드 배열',
    example: [
      {
        mentor: {
          id: 'uuid',
          name: '김나경',
          intraId: 'm-???',
          tags: null,
          profileImage: '링크',
          introduction: '안녕',
        },
        keywords: ['SW아키텍쳐', 'IoT', 'AI'],
      },
    ],
  })
  mentors: MentorsListElement[];
}
