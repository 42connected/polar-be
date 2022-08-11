import { Bocals } from '../../entities/bocals.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBocalDto } from 'src/v1/dto/bocals/create-bocals.dto';

import { jwtUser } from 'src/v1/interface/jwt-user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class BocalsService {
  constructor(
    @InjectRepository(Bocals) private bocalsRepository: Repository<Bocals>,
  ) {}

  async createUser(user: CreateBocalDto): Promise<jwtUser> {
    try {
      const createdUser: Bocals = await this.bocalsRepository.create(user);
      await this.bocalsRepository.save(createdUser);
      return {
        id: createdUser.id,
        intraId: createdUser.intraId,
        role: 'admin',
      };
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 데이터 생성 중 에러가 발생했습니다.',
      );
    }
  }

  async findByIntra(intraId: string): Promise<jwtUser> {
    try {
      const foundUser: Bocals = await this.bocalsRepository.findOneBy({
        intraId,
      });
      return { id: foundUser?.id, intraId: foundUser?.intraId, role: 'cadet' };
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 데이터 검색 중 에러가 발생했습니다.',
      );
    }
  }
}
