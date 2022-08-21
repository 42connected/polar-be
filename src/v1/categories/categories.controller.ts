import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMentorsQueryDto } from '../dto/mentors/get-mentors.dto';
import { Categories } from '../entities/categories.entity';
import { MentorsList } from '../interface/mentors/mentors-list.interface';
import { CategoriesService } from './service/categories.service';
import { KeywordsService } from './service/keywords.service';
import { SearchMentorsService } from './service/search-mentors.service';

@Controller()
@ApiTags('categories API')
export class CategoriesController {
  constructor(
    private categoriesService: CategoriesService,
    private searchMentorsService: SearchMentorsService,
    private keywordsService: KeywordsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'getcategories API',
    description: '카테고리 가져오기 api',
  })
  @ApiCreatedResponse({
    description: '카테고리 받아오기 성공',
    type: Promise<Categories[]>,
  })
  getCategories(): Promise<Categories[]> {
    return this.categoriesService.getCategories();
  }

  @Get('/:category/keywords')
  @ApiOperation({
    summary: 'getKeywords API',
    description: '카테고리의 키워드 가져오기 api',
  })
  @ApiCreatedResponse({
    description: '키워드 받아오기 성공',
    type: Promise<string[]>,
  })
  async getKeywords(
    @Param('category') categoryName: string,
  ): Promise<string[]> {
    const category = await this.categoriesService.getCategoryByName(
      categoryName,
    );
    return this.searchMentorsService.getKeywordsByCategoryId(category.id);
  }

  @Get(':category')
  @ApiOperation({
    summary: 'getMentors API',
    description: '멘토리스트 받아오는 api',
  })
  @ApiCreatedResponse({
    description: '멘토리스트 받아오기 성공',
    type: Promise<MentorsList>,
  })
  async getMentors(
    @Query() getMentorsQueryDto: GetMentorsQueryDto,
    @Param('category') categoryName: string,
  ): Promise<MentorsList> {
    const { keywords, mentorName } = getMentorsQueryDto;
    const category: Categories = await this.categoriesService.getCategoryByName(
      categoryName,
    );
    if (
      !(await this.searchMentorsService.validateKeywords(category.id, keywords))
    ) {
      throw new BadRequestException('잘못된 키워드가 포함되어 있습니다.');
    }
    const keywordIds: string[] | null =
      await this.keywordsService.getKeywordIds(keywords);
    return this.searchMentorsService.getMentorList(
      category,
      keywordIds,
      mentorName,
    );
  }
}
