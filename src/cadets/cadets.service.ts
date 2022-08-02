import { Injectable } from '@nestjs/common';
import { CreateCadetDto } from '../dto/create-cadet.dto';

@Injectable()
export class CadetsService {
  createUser(user: CreateCadetDto) {
    console.log('Create cadet', user);
    return { id: 1, username: 'nakkim' };
  }

  findByIntra(intraId: string) {
    // 찾아서 없으면
    console.log(`Find By ${intraId}`);
    return null;
  }
}
