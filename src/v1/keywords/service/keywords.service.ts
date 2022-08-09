import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  // async createKeyword(name: string): Promise<void> {
  //   const newKeyword = this.keywordsRepository.create({
  //     name: name,
  //   });
  //   try {
  //     await this.keywordsRepository.save(newKeyword);
  //   } catch {
  //     throw new ConflictException('중복된 키워드를 등록하셨습니다');
  //   }
  //   return;
  // }

  // async deleteKeyword(name: string): Promise<void> {
  //   const result = await this.keywordsRepository.delete({ name: name });
  //   if (result.affected === 0) {
  //     throw new NotFoundException('등록되지 않은 분야입니다');
  //   }
  //   return;
  // }
}
