import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { CreateKeywordDto } from '../dto/keywords/create-keyword.dto';
import { DeleteKeywordDto } from '../dto/keywords/delete-keyword.dto';
import { Keywords } from '../entities/keywords.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { KeywordsService } from './service/keywords.service';

@Controller()
export class KeywordsController {
  constructor(private keywordsService: KeywordsService) {}

  @Get()
  @Roles('cadet', 'mentor')
  @UseGuards(JwtGuard, RolesGuard)
  getKeywords(): Promise<Keywords[]> {
    return this.keywordsService.getKeywords();
  }

  @Post()
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  createKeyword(@Body() createKeywordDto: CreateKeywordDto): Promise<void> {
    const { name } = createKeywordDto;
    return this.keywordsService.createKeyword(name);
  }

  @Delete()
  @Roles('mentor')
  @UseGuards(JwtGuard, RolesGuard)
  deleteKeyword(@Body() deleteKeywordDto: DeleteKeywordDto): Promise<void> {
    const { name } = deleteKeywordDto;
    return this.keywordsService.deleteKeyword(name);
  }
}
