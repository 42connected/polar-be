import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { MentorKeywords } from 'src/v1/entities/mentor-keywords.entity';
import { Repository, Like } from 'typeorm';
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

  async getMentorsInfoByText(
    mentorName: string,
    mentorSimpleInfo?: MentorSimpleInfo[],
  ): Promise<MentorSimpleInfo[]> {
    let matchMentors: MentorSimpleInfo[] = [];

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
    } else {
      try {
        matchMentors = await this.mentorsRepository.find({
          select: { id: true, name: true, intraId: true },
          where: [
            { intraId: Like(`%${mentorName}%`) },
            { name: Like(`%${mentorName}%`) },
          ],
        });
      } catch {
        throw new ConflictException(
          '멘토 정보를 가져오는 도중 오류가 발생했습니다..!',
        );
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
      mentorsInfo = await this.getMentorsInfoByText(mentorName, mentorsInfo);
    }
    const mentorList: MentorsListElement[] = await this.getMentorListElements(
      mentorsInfo,
    );
    result.mentors = mentorList;
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
}
