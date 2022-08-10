import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keywords } from 'src/v1/entities/keywords.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(Keywords)
    private keywordsRepository: Repository<Keywords>,
  ) {}

  async getKeywords(): Promise<Keywords[]> {
    try {
      const found = await this.keywordsRepository.find({
        select: { name: true },
        take: 8,
      });
      return found;
    } catch {
      throw new ConflictException();
    }
  }
}
