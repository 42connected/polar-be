import { Controller, Get } from '@nestjs/common';
import { Keywords } from '../entities/keywords.entity';
import { KeywordsService } from './service/keywords.service';

@Controller()
export class KeywordsController {
  constructor(private keywordsService: KeywordsService) {}

  @Get()
  getKeywords(): Promise<Keywords[]> {
    return this.keywordsService.getKeywords();
  }

  // @Post()
  // @Roles('mentor')
  // @UseGuards(JwtGuard, RolesGuard)
  // createKeyword(@Body() createKeywordDto: CreateKeywordDto): Promise<void> {
  //   const { name } = createKeywordDto;
  //   return this.keywordsService.createKeyword(name);
  // }

  // @Delete()
  // @Roles('mentor')
  // @UseGuards(JwtGuard, RolesGuard)
  // deleteKeyword(@Body() deleteKeywordDto: DeleteKeywordDto): Promise<void> {
  //   const { name } = deleteKeywordDto;
  //   return this.keywordsService.deleteKeyword(name);
  // }
}
