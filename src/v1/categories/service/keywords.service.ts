import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
import { Keywords } from 'src/v1/entities/keywords.entity';
import { MentorKeywords } from 'src/v1/entities/mentor-keywords.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(Keywords)
    private keywordsRepository: Repository<Keywords>,
    @InjectRepository(MentorKeywords)
    private mentorKeywordsRepository: Repository<MentorKeywords>,
    @InjectRepository(Mentors)
    private mentorsRepository: Repository<Mentors>,
  ) {}

  async getKeywordIds(keywords: string[]): Promise<string[]> | null {
    if (!keywords) {
      return null;
    }
    const keywordIds: string[] = (
      await this.keywordsRepository
        .createQueryBuilder('keywords')
        .where('keywords.name IN (:...keywords)', { keywords })
        .getMany()
    ).map(obj => obj.id);
    return keywordIds;
  }

  async deleteAllKeywords(mentor: Mentors): Promise<void> {
    try {
      const found: MentorKeywords[] =
        await this.mentorKeywordsRepository.findBy({
          mentorId: mentor.id,
        });
      await this.mentorKeywordsRepository.remove(found);
    } catch (err) {
      throw new ConflictException('데이터 삭제 중 에러가 발생했습니다.');
    }
  }

  async findById(id: string): Promise<Keywords> {
    let result: Keywords;
    try {
      result = await this.keywordsRepository.findOneBy({ id });
      return result;
    } catch (err) {
      throw new ConflictException('데이터 검색 중 에러가 발생했습니다.');
    }
  }

  async saveMentorKeyword(
    mentor: Mentors,
    keywordId: string,
  ): Promise<MentorKeywords> {
    const keyword = await this.findById(keywordId);
    const created: MentorKeywords = this.mentorKeywordsRepository.create({
      mentorId: mentor.id,
      keywordId: keyword.id,
      keywords: keyword,
      mentors: mentor,
    });
    try {
      await this.mentorKeywordsRepository.save(created);
      return created;
    } catch (err) {
      throw new ConflictException('데이터 저장 중 에러가 발생했습니다.');
    }
  }

  async getKeywordIdsByMentorId(id: string): Promise<string[]> {
    const results: MentorKeywords[] =
      await this.mentorKeywordsRepository.findBy({ mentorId: id });
    const keywordIds: string[] = results.map(obj => obj.keywordId);
    return keywordIds;
  }

  async getMentorKeywordsTunned(intraId: string) {
    const keywords: string[] = [];
    const found = await this.mentorKeywordsRepository.find({
      relations: { mentors: true, keywords: true },
      select: {
        mentors: {},
        keywords: { name: true },
      },
      where: { mentors: { intraId: intraId } },
    });
    found.map(async e => keywords.push(e.keywords.name));
    return keywords;
  }
}
