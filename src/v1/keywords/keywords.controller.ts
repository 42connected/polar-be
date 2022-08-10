import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Keywords } from '../entities/keywords.entity';
import { KeywordsService } from './service/keywords.service';

@Controller()
@ApiTags('keywords API')
export class KeywordsController {
  constructor(private keywordsService: KeywordsService) {}

  @Get()
  getKeywords(): Promise<Keywords[]> {
    return this.keywordsService.getKeywords();
  }
}
