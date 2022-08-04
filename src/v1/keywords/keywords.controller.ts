import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { CreateKeywordDto } from '../dto/keywords/create-keyword.dto';
import { DeleteKeywordDto } from '../dto/keywords/delete-keyword.dto';
import { Keywords } from '../entities/keywords.entity';
import { KeywordsService } from './service/keywords.service';

@Controller()
export class KeywordsController {
  constructor(private keywordsService: KeywordsService) {}
  @Get()
  getKeywords(): Promise<Keywords[]> {
    return this.keywordsService.getKeywords();
  }

  @Post()
  createKeyword(@Body() createKeywordDto: CreateKeywordDto): Promise<void> {
    const { name } = createKeywordDto;
    return this.keywordsService.createKeyword(name);
  }

  @Delete()
  deleteKeyword(@Body() deleteKeywordDto: DeleteKeywordDto): Promise<void> {
    const { name } = deleteKeywordDto;
    return this.keywordsService.deleteKeyword(name);
  }
}
