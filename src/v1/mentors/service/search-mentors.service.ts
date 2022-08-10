import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { MentorKeywords } from 'src/v1/entities/mentor-keywords.entity';
import { Repository } from 'typeorm';
import { MentorSimpleInfo } from 'src/v1/interface/mentors/mentor-simple-info.interface';
import { MentorsListElement } from 'src/v1/interface/mentors/mentors-list-element.interface';
import { MentorsList } from 'src/v1/interface/mentors/mentors-list.interface';
import { KeywordCategories } from 'src/v1/entities/keyword-categories.entity';
import { MentorRawSimpleInfo } from 'src/v1/interface/mentors/mentor-raw-simple-info.interface';
import { Categories } from 'src/v1/entities/categories.entity';

@Injectable()
export class SearchMentorsService {
  constructor(
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
    @InjectRepository(MentorKeywords)
    private mentorKeywordsRepository: Repository<MentorKeywords>,
    @InjectRepository(KeywordCategories)
    private keywordCategoriesRepository: Repository<KeywordCategories>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getMentorList(
    categoryId?: string,
    keywordsId?: string[],
    searchText?: string,
  ): Promise<MentorsList> {
    const result: MentorsList = {
      mentorCount: 0,
      mentors: [],
    };

    if (categoryId) {
      try {
        result.category = await this.getCategoryInfo(categoryId);
      } catch (error) {
        throw new ConflictException(error);
      }
      if (keywordsId) {
        let keywords: string[];
        try {
          keywords = await this.getKeywordsByCategory(categoryId);
        } catch (error) {
          throw new ConflictException(error);
        }
        keywordsId.forEach(keywordId => {
          if (!keywords.includes(keywordId))
            throw new NotFoundException('잘못된 키워드가 포함되었습니다.');
        });
      }
    }

    let mentorsInfo: MentorSimpleInfo[];

    if (keywordsId) {
      try {
        mentorsInfo = await this.getMentorsInfoByKeywords(keywordsId);
      } catch (error) {
        throw new ConflictException(error);
      }
    } else if (categoryId) {
      try {
        mentorsInfo = await this.getMentorsInfoByCategory(categoryId);
      } catch (error) {
        throw new ConflictException(error);
      }
    }
    if (searchText) {
      try {
        mentorsInfo = await this.getMentorsInfoByText(searchText, mentorsInfo);
      } catch (error) {
        throw new ConflictException(error);
      }
    }
    try {
      const mentorList: MentorsListElement[] = await this.getMentorListElements(
        mentorsInfo,
      );
      result.mentors = mentorList;
      result.mentorCount = mentorList?.length;
    } catch {
      throw new ConflictException(
        '멘토 정보를 가져오는 도중 오류가 발생했습니다.',
      );
    }
    return result;
  }

  async getCategoryInfo(CategoryId: string): Promise<Categories> {
    let category: Categories;

    try {
      category = await this.categoriesRepository.findOneBy({
        id: CategoryId,
      });
    } catch {
      throw new ConflictException(
        '키워드 그룹 값을 가져오는 도중 오류가 발생했습니다.',
      );
    }
    if (!category)
      throw new NotFoundException('키워드 그룹이 존재하지 않습니다.');
    return category;
  }

  async getKeywordsByCategory(categoryId: string): Promise<string[]> {
    const keywordsId: string[] = [];

    let keywordCategories: KeywordCategories[];
    try {
      keywordCategories = await this.keywordCategoriesRepository.find({
        select: { keywordId: true },
        where: { categoryId: categoryId },
      });
    } catch {
      throw new ConflictException(
        '그룹의 키워드 값을 가져오는 도중 오류가 발생했습니다.',
      );
    }
    if (!keywordCategories)
      throw new NotFoundException('해당 그룹에 키워드가 존재하지 않습니다.');
    keywordCategories.forEach(keyword => keywordsId.push(keyword.keywordId));
    return keywordsId;
  }

  async getMentorsInfoByCategory(
    categoryId: string,
  ): Promise<MentorSimpleInfo[]> {
    let keywordsId: string[];
    let rawMentorInfos: MentorRawSimpleInfo[];
    const matchMentors: MentorSimpleInfo[] = [];
    try {
      keywordsId = await this.getKeywordsByCategory(categoryId);
    } catch (error) {
      throw new ConflictException(error);
    }

    try {
      rawMentorInfos = await this.getRawMentorsInfoByKeywords(keywordsId);
    } catch (error) {
      throw new ConflictException(error);
    }

    rawMentorInfos.forEach(rawInfo => {
      matchMentors.push({
        id: rawInfo.id,
        name: rawInfo.name,
        intraId: rawInfo.intraid,
      });
    });

    return matchMentors;
  }

  async getRawMentorsInfoByKeywords(
    keywordId: string[],
  ): Promise<MentorRawSimpleInfo[]> {
    let rawMentorInfos: MentorRawSimpleInfo[];
    try {
      rawMentorInfos = await this.mentorKeywordsRepository
        .createQueryBuilder('mentorKeywords')
        .leftJoinAndSelect(
          Mentors,
          'mentors',
          'mentorKeywords.mentorId = mentors.id',
        )
        .select([
          'mentors.id AS id',
          'mentors.name AS name',
          'mentors.intraId AS intraId',
        ])
        .where('mentorKeywords.keywordId IN (:...keywordIds)', {
          keywordIds: keywordId,
        })
        .groupBy('mentors.id')
        .addSelect('COUNT(*) AS count')
        .getRawMany();
    } catch {
      throw new ConflictException(
        '멘토 정보를 가져오는 도중 오류가 발생했습니다.',
      );
    }
    if (!rawMentorInfos) {
      throw new NotFoundException(
        '키워드와 일치하는 멘토가 존재하지 않습니다.',
      );
    }
    return rawMentorInfos;
  }

  async getMentorsInfoByKeywords(
    keywordId: string[],
  ): Promise<MentorSimpleInfo[]> {
    const matchMentors: MentorSimpleInfo[] = [];
    let rawMentorInfos: MentorRawSimpleInfo[];
    try {
      rawMentorInfos = await this.getRawMentorsInfoByKeywords(keywordId);
    } catch (error) {
      throw new ConflictException(error);
    }

    rawMentorInfos.forEach(rawInfo => {
      if (+rawInfo.count === keywordId.length)
        matchMentors.push({
          id: rawInfo.id,
          name: rawInfo.name,
          intraId: rawInfo.intraid,
        });
    });
    if (matchMentors.length === 0) {
      throw new NotFoundException(
        '검색 정보와 일치하는 멘토가 존재하지 않습니다.',
      );
    }

    return matchMentors;
  }

  async getMentorsInfoByText(
    searchText: string,
    mentorSimpleInfo?: MentorSimpleInfo[],
  ): Promise<MentorSimpleInfo[]> {
    let matchMentors: MentorSimpleInfo[];
    if (mentorSimpleInfo && mentorSimpleInfo.length !== 0) {
      mentorSimpleInfo.forEach(mentor => {
        if (mentor.id === searchText || mentor.name === searchText)
          matchMentors.push(mentor);
      });
    } else {
      try {
        matchMentors = await this.mentorsRepository.find({
          select: { id: true, name: true, intraId: true },
          where: [{ intraId: searchText }, { name: searchText }],
        });
      } catch {
        throw new ConflictException(
          '멘토 정보를 가져오는 도중 오류가 발생했습니다.',
        );
      }
    }
    if (matchMentors.length === 0) {
      throw new NotFoundException(
        '검색 정보와 일치하는 멘토가 존재하지 않습니다.',
      );
    }

    return matchMentors;
  }

  async getMentorListElements(
    matchMentors: MentorSimpleInfo[],
  ): Promise<MentorsListElement[]> {
    const mentorList: MentorsListElement[] = [];
    for (const mentorInfo of matchMentors) {
      const keywords: string[] = [];
      try {
        const rawKeywordInfo: MentorKeywords[] =
          await this.mentorKeywordsRepository.find({
            where: { mentorId: mentorInfo.id },
            relations: { keywords: true },
          });
        if (!rawKeywordInfo) continue;
        rawKeywordInfo.forEach(keywordInfo => {
          keywords.push(keywordInfo.keywords.name);
        });
      } catch {
        throw new ConflictException(
          '멘토 키워드 정보를 가져오는 도중 오류가 발생했습니다.',
        );
      }

      mentorList.push({ mentor: mentorInfo, keywords: keywords });
    }
    return mentorList;
  }
}
