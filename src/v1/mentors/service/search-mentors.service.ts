import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mentors } from 'src/entities/mentors.entity';
import { MentorKeywords } from 'src/entities/mentor-keywords.entity';
import { Keywords } from 'src/entities/keywords.entity';
import { Repository } from 'typeorm';
import {
  MentorInfo,
  MentorsListElement,
  MentorsList,
} from 'src/v1/dto/mentors/mentors.dto';

@Injectable()
export class SearchMentorsService {
  constructor(
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
    @InjectRepository(MentorKeywords)
    private mentorKeywordsRepository: Repository<MentorKeywords>,
    @InjectRepository(Keywords)
    private keywordsRepository: Repository<Keywords>,
  ) {}

  async getMentorListByKeyword(
    keywordId: string,
    searchText?: string,
  ): Promise<MentorsList> {
    const result: MentorsList = {
      keyword: { id: '', name: '' },
      mentorCount: 0,
      mentors: [],
    };
    try {
      result.keyword = await this.keywordsRepository.findOneBy({
        id: keywordId,
      });
      if (!result.keyword) {
        throw new NotFoundException('키워드가 존재하지 않습니다.');
      }
    } catch {
      throw new ConflictException(
        '키워드 값을 가져오는 도중 오류가 발생했습니다.',
      );
    }

    const matchMentors: MentorInfo[] = [];
    try {
      const rawMentorInfos: MentorKeywords[] =
        await this.mentorKeywordsRepository.find({
          where: { keywordId },
          relations: { mentors: true },
        });
      if (!rawMentorInfos) {
        throw new NotFoundException(
          '키워드와 일치하는 멘토가 존재하지 않습니다.',
        );
      }
      rawMentorInfos.forEach(rawMentorInfo => {
        if (searchText) {
          if (
            rawMentorInfo.mentors.name === searchText ||
            rawMentorInfo.mentors.intraId === searchText
          )
            matchMentors.push({
              id: rawMentorInfo.mentors.id,
              name: rawMentorInfo.mentors.name,
              intraId: rawMentorInfo.mentors.intraId,
            });
        } else
          matchMentors.push({
            id: rawMentorInfo.mentors.id,
            name: rawMentorInfo.mentors.name,
            intraId: rawMentorInfo.mentors.intraId,
          });
      });
    } catch {
      throw new ConflictException(
        '멘토 정보를 가져오는 도중 오류가 발생했습니다.',
      );
    }
    if (matchMentors.length === 0) {
      throw new NotFoundException(
        '검색 정보와 일치하는 멘토가 존재하지 않습니다.',
      );
    }

    const mentorList: MentorsListElement[] = await this.getMentorList(
      matchMentors,
    );
    result.mentors = mentorList;
    result.mentorCount = mentorList?.length;
    return result;
  }

  async getMentorListBySearch(searchText: string): Promise<MentorsList> {
    const result: MentorsList = {
      mentorCount: 0,
      mentors: [],
    };

    try {
      const matchMentors: MentorInfo[] = await this.mentorsRepository.find({
        select: { id: true, name: true, intraId: true },
        where: [{ intraId: searchText }, { name: searchText }],
      });
      if (matchMentors.length === 0) {
        throw new NotFoundException(
          '검색 정보와 일치하는 멘토가 존재하지 않습니다.',
        );
      }
      const mentorList: MentorsListElement[] = await this.getMentorList(
        matchMentors,
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

  async getMentorList(
    matchMentors: MentorInfo[],
  ): Promise<MentorsListElement[]> {
    const mentorList: MentorsListElement[] = [];
    for (const mentorInfo of matchMentors) {
      if (!mentorInfo) continue;

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
