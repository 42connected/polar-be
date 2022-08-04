import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCadetDto } from 'src/v1/dto/create-cadet.dto';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CadetsService {
  constructor(
    @InjectRepository(Cadets) private cadetsRepository: Repository<Cadets>,
  ) {}

  async createUser(user: CreateCadetDto) {
    console.log('Create cadet', user);
    return { id: 1, name: 'nakkim', role: 'cadet' };
  }

  findByIntra(intraId: string) {
    // 찾아서 없으면
    console.log(`Find By ${intraId}`);
    return null;
  }
}
