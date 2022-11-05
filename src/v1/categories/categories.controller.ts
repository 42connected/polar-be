import {
  BadRequestException,
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMentorsQueryDto } from '../dto/mentors/get-mentors.dto';
import { Categories } from '../entities/categories.entity';
import { MentorsList } from '../interface/mentors/mentors-list.interface';
import { CategoriesService } from './service/categories.service';
import { KeywordsService } from './service/keywords.service';
import { SearchMentorsService } from './service/search-mentors.service';
import { GetCategoriesDto } from '../dto/categories/get-categories.dto';
import { MentorsListDto } from '../dto/categories/mentor-list.dto';
import { CategoryDto } from '../dto/categories/categories.dto';

/**
 * 키워드는 카테고리 안에 포함되는 개념이다.
 *
 * 카테고리 > 키워드
 */
@Controller()
@UseInterceptors(CacheInterceptor)
@ApiTags('Categories API')
export class CategoriesController {
  constructor(
    private categoriesService: CategoriesService,
    private searchMentorsService: SearchMentorsService,
    private keywordsService: KeywordsService,
  ) {}

  /**
   * 모든 카테고리를 배열로 반환한다.
   * @returns [{name: %category}, ...]
   */
  @Get()
  @ApiOperation({
    summary: 'Get category array',
    description: '카테고리 이름이 담긴 객체 배열을 반환합니다.',
  })
  @ApiCreatedResponse({
    description: '카테고리 객체 배열',
    type: GetCategoriesDto,
    isArray: true,
    status: 200,
  })
  async getCategories(): Promise<GetCategoriesDto[]> {
    return this.categoriesService.getCategories();
  }

  /**
   * 모든 카테고리와, 각각의 카테고리가 포함하는 키워드를 배열로 반환한다.
   * @returns [{name: %category, keywords: [keyword, ...]}, ...]
   */
  @Get('/category/keywords')
  @ApiOperation({
    summary: 'Get category object array',
    description: '키워드를 포함한 모든 카테고리 객체 배열을 반환합니다.',
  })
  @ApiCreatedResponse({
    description: '카테고리 객체 배열',
    type: CategoryDto,
    isArray: true,
    status: 200,
  })
  async getCategoriesWithKeywords(): Promise<CategoryDto[]> {
    const categories: Categories[] =
      await this.categoriesService.getAllCategories();
    return this.categoriesService.formatAllCategories(categories);
  }

  /**
   * 파라미터로 들어온 카테고리가 포함하는 키워드를 배열로 반환한다.
   * @param categoryName 카테고리 이름
   * @returns [keyword, ...]
   */
  @Get('/:category/keywords')
  @ApiOperation({
    summary: 'Get category keywords',
    description: '해당 카테고리에 포함되는 키워드를 반환합니다.',
  })
  @ApiCreatedResponse({
    description: '키워드 이름 배열',
    type: String,
    isArray: true,
    status: 200,
  })
  async getKeywords(
    @Param('category') categoryName: string,
  ): Promise<string[]> {
    const category = await this.categoriesService.getCategoryByName(
      categoryName,
    );
    return this.searchMentorsService.getKeywordsByCategoryId(category.id);
  }

  /**
   * 해당 카테고리 내에서 Query로 들어온 키워드와 멘토 이름이 포함되는 멘토 리스트를 찾아 반환한다.
   * @param getMentorsQueryDto 키워드[], 멘토 이름
   * @param categoryName 카테고리 이름
   * @returns 멘토 카운트와 멘토에 대한 정보를 배열로 반환한다.
   * */
  @Get(':category')
  @CacheTTL(60)
  @ApiOperation({
    summary: 'Get mentor list',
    description:
      '카테고리(+ keywords, mentorName)를 포함하는 멘토의 리스트를 반환합니다.',
  })
  @ApiCreatedResponse({
    description: '멘토 리스트, 멘토 수, 카테고리 정보',
    type: MentorsListDto,
    status: 200,
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
