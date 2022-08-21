import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keywords } from 'src/v1/entities/keywords.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(Keywords)
    private keywordsRepository: Repository<Keywords>,
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
}
