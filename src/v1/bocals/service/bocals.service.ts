import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBocalDto } from 'src/v1/dto/bocals/create-bocal.dto';
import { jwtUser } from 'src/v1/interface/jwt-user.interface';
import { Admins } from 'src/v1/entities/admins.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BocalsService {
  constructor(
    @InjectRepository(Admins) private adminsRepository: Repository<Admins>,
  ) {}

  async createUser(user: CreateBocalDto): Promise<jwtUser> {
    try {
      const createdUser: Admins = await this.adminsRepository.create(user);
      await this.adminsRepository.save(createdUser);
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
      const foundUser: Admins = await this.adminsRepository.findOneBy({
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
