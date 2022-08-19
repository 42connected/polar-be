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
import { GetMentorsQueryDto } from 'src/v1/dto/mentors/get-mentors.dto';
import { Keywords } from 'src/v1/entities/keywords.entity';

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
    @InjectRepository(Keywords)
    private keywordsRepository: Repository<Keywords>,
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
    if (matchMentors.length === 0) {
      throw new NotFoundException(
        '검색 정보와 일치하는 멘토가 존재하지 않습니다.',
      );
    }
    return matchMentors;
  }

  async getKeywordsByCategoryId(categoryId: string) {
    const objs = await this.keywordCategoriesRepository.find({
      where: { categoryId },
    });
    const keywordObjs = objs.map(async obj => {
      const keyword = (
        await this.keywordsRepository.findOneBy({
          id: obj.keywordId,
        })
      ).name;
      return keyword;
    });
    return keywordObjs;
  }

  async getMentorList(
    category,
    getMentorsQueryDto: GetMentorsQueryDto,
  ): Promise<MentorsList> {
    const result: MentorsList = {
      mentorCount: 0,
      mentors: [],
    };
    const { keywords, mentorName } = getMentorsQueryDto;
    let categoryId: string;
    try {
      categoryId = await (
        await this.categoriesRepository.findOneBy({
          name: category,
        })
      ).id;
    } catch (error) {
      throw new ConflictException(error);
    }
    result.category = category;

    let mentorsInfo: MentorSimpleInfo[];
    if (keywords) {
      const categoriesKeywords = await this.getKeywordsByCategoryId(categoryId);
      // Promise.all(categoriesKeywords).then(categoriesKeyword => {
      //   keywords.forEach(keyword => {
      //     if (!categoriesKeyword.includes(keyword)) {
      //       throw new ConflictException('잘못된 키워드가 포함되어 있습니다.');
      //     }
      //   });
      // });
      Promise.all(categoriesKeywords)
        .then(categoriesKeyword => {
          keywords.forEach(keyword => {
            if (!categoriesKeyword.includes(keyword)) {
              throw new NotFoundException('잘못된 키워드가 포함되어 있습니다.');
            }
          });
        })
        .catch(err => {
          console.log(err);
          // throw new NotFoundException('잘못된 키워드가 포함되어 있습니다.');
        });
      const keywordIds: string[] = (
        await this.keywordsRepository
          .createQueryBuilder('keywords')
          .where('keywords.name IN (:...keywords)', { keywords })
          .getMany()
      ).map(obj => obj.id);
      try {
        mentorsInfo = await this.getMentorsInfoByKeywords(keywordIds);
      } catch (error) {
        throw new ConflictException(error);
      }
    } else if (categoryId) {
      mentorsInfo = await this.getMentorsInfoByCategory(categoryId);
    }
    if (mentorName) {
      try {
        mentorsInfo = await this.getMentorsInfoByText(mentorName, mentorsInfo);
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

  async getCategoryInfo(categoryId: string): Promise<Categories> {
    let category: Categories;

    if (!category)
      throw new NotFoundException('키워드 그룹이 존재하지 않습니다.');
    return category;
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
        profileImage: rawInfo.profileImage,
      });
    });
    return matchMentors;
  }

  async getRawMentorsInfoByKeywords(
    keywordsId: string[],
  ): Promise<MentorRawSimpleInfo[]> {
    if (keywordsId.length === 0) {
      throw new NotFoundException(
        '키워드와 일치하는 멘토가 존재하지 않습니다.',
      );
    }
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
          'mentors.profileImage AS profileImage',
          'mentors.tags AS tags',
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
    const rawMentorInfos: MentorRawSimpleInfo[] =
      await this.getRawMentorsInfoByKeywords(keywordId);

    rawMentorInfos.forEach(rawInfo => {
      if (+rawInfo.count === keywordId.length)
        matchMentors.push({
          id: rawInfo.id,
          name: rawInfo.name,
          intraId: rawInfo.intraid,
          tags: rawInfo.tags,
          profileImage: rawInfo.profileImage,
        });
    });
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
