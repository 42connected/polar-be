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
  ) {}

  /**
   * 멘토 배열안에 멘토 이름과 일치하는 멘토를 반환한다
   * @param mentorName 멘토 이름
   * @returns MentorSimpleInfo[]
   */
  async matchMentorsByName(
    mentorName: string,
    mentorSimpleInfo?: MentorSimpleInfo[],
  ): Promise<MentorSimpleInfo[]> {
    const matchMentors: MentorSimpleInfo[] = [];

    if (mentorSimpleInfo?.length !== 0) {
      try {
        mentorSimpleInfo.forEach(mentor => {
          if (
            mentor.intraId.includes(mentorName) ||
            mentor.name.includes(mentorName)
          ) {
            matchMentors.push(mentor);
          }
        });
      } catch (error) {
        throw new ConflictException(error);
      }
    }
    return matchMentors;
  }

  async getKeywordsByCategoryId(categoryId: string): Promise<string[]> {
    const objs: KeywordCategories[] =
      await this.keywordCategoriesRepository.find({
        where: { categoryId },
        relations: {
          keywords: true,
        },
      });
    const keywords: string[] = objs.map(obj => obj.keywords.name);
    return keywords;
  }

  /**
   * 카테고리가 키워드 배열을 포함하는지 검사하는 함수
   * @param categoryId 카테고리 이름
   * @param keywords 키워드가 담긴 배열
   * @returns boolean
   */
  async validateKeywords(
    categoryId: string,
    keywords: string[],
  ): Promise<boolean> {
    if (!keywords) {
      return true;
    }
    const categoriesKeywords: string[] = await this.getKeywordsByCategoryId(
      categoryId,
    );
    const result: boolean[] = keywords.map(keyword => {
      return categoriesKeywords.includes(keyword);
    });
    return result.every(val => val === true);
  }

  /**
   * 카테고리 내에 키워드를 포함하고 멘토 이름이 일치하는 멘토 리스트를 반환하는 함수
   * @param category 카테고리 이름
   * @param keywordIds 키워드 UUID
   * @param mentorName 멘토 이름
   * @returns MentorList
   */
  async getMentorList(
    category: Categories,
    keywordIds?: string[],
    mentorName?: string,
  ): Promise<MentorsList> {
    const result: MentorsList = {
      mentorCount: 0,
      mentors: [],
    };
    result.category = category;

    let mentorsInfo: MentorSimpleInfo[];
    if (keywordIds) {
      mentorsInfo = await this.getMentorsInfoByKeywords(keywordIds);
    } else if (category) {
      mentorsInfo = await this.getMentorsInfoByCategory(category.id);
    }
    if (mentorName) {
      mentorsInfo = await this.matchMentorsByName(mentorName, mentorsInfo);
    }
    const mentorList: MentorsListElement[] = await this.getMentorListElements(
      mentorsInfo,
    );
    result.mentors = this.sortMentorListByActiveStatus(mentorList);
    result.mentorCount = mentorList?.length;
    return result;
  }

  async getKeywordsIdByCategory(categoryId: string): Promise<string[]> {
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

  /**
   * 카테고리에 포함하는 멘토를 반환한다
   * @param categoryId 카테고리 이름
   * @returns MentorSimpleInfo[]
   */
  async getMentorsInfoByCategory(
    categoryId: string,
  ): Promise<MentorSimpleInfo[]> {
    const matchMentors: MentorSimpleInfo[] = [];
    const keywordsId: string[] = await this.getKeywordsIdByCategory(categoryId);
    const rawMentorInfos: MentorRawSimpleInfo[] =
      await this.getRawMentorsInfoByKeywords(keywordsId);
    rawMentorInfos.forEach(rawInfo => {
      matchMentors.push({
        id: rawInfo.id,
        name: rawInfo.name,
        intraId: rawInfo.intraid,
        tags: rawInfo.tags,
        profileImage: rawInfo.profileimage || null,
        introduction: rawInfo.introduction,
        isActive: rawInfo.isactive,
      });
    });
    return matchMentors;
  }

  async getRawMentorsInfoByKeywords(
    keywordsId: string[],
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
          'mentors.intraId AS intraid',
          'mentors.profileImage AS profileimage',
          'mentors.tags AS tags',
          'mentors.introduction AS introduction',
          'mentors.isActive AS isactive',
        ])
        .where('mentorKeywords.keywordId IN (:...keywordsId)', {
          keywordsId: keywordsId,
        })
        .groupBy('mentors.id')
        .addSelect('COUNT(*) AS count')
        .getRawMany();
    } catch {
      throw new ConflictException(
        '멘토 정보를 가져오는 도중 오류가 발생했습니다!',
      );
    }
    return rawMentorInfos;
  }

  /**
   * 키워드 ID 배열을 포함하는 멘토를 반환한다
   * @param keywordId 키워드 ID 배열
   * @returns MentorSimpleInfo[]
   */
  async getMentorsInfoByKeywords(
    keywordId: string[],
  ): Promise<MentorSimpleInfo[]> {
    const matchMentors: MentorSimpleInfo[] = [];
    const rawMentorInfos: MentorRawSimpleInfo[] =
      await this.getRawMentorsInfoByKeywords(keywordId);

    rawMentorInfos.forEach(rawInfo => {
      if (+rawInfo.count === keywordId.length)
        matchMentors.push({
          id: rawInfo.id,
          name: rawInfo.name,
          intraId: rawInfo.intraid,
          tags: rawInfo.tags,
          profileImage: rawInfo.profileimage || null,
          introduction: rawInfo.introduction,
          isActive: rawInfo.isactive,
        });
    });
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

  /**
   * @param mentorList 멘토 리스트
   * @returns 멘토 이름을 기준으로 오름차순으로 정렬된 멘토 리스트 반환
   */
  sortMentorListByAsc(mentorList: MentorsListElement[]): MentorsListElement[] {
    mentorList.sort((m1, m2) => {
      return m1.mentor.name < m2.mentor.name
        ? -1
        : m1.mentor.name > m2.mentor.name
        ? 1
        : 0;
    });
    return mentorList;
  }

  /**
   * @param mentorList 멘토 리스트
   * @returns 랜덤하게 섞인 멘토 리스트 반환
   */
  suffleMentorList(mentorList: MentorsListElement[]): MentorsListElement[] {
    const shuffle = () => Math.random() - 0.5;
    return mentorList.sort(shuffle);
  }

  /**
   * @param mentorList 멘토 리스트
   * @returns 멘토 활성화 상태를 기준으로 정렬된 멘토 리스트 반환
   */
  sortMentorListByActiveStatus(
    mentorList: MentorsListElement[],
  ): MentorsListElement[] {
    mentorList.sort((m1, m2) => {
      if (m1.mentor.isActive) {
        if (m2.mentor.isActive) return 0;
        return -1;
      } else {
        if (m2.mentor.isActive) return 1;
        return 0;
      }
    });
    return mentorList;
  }
}
