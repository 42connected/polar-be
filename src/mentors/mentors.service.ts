import { Injectable } from '@nestjs/common';
import { CreateMentorDto } from '../dto/create-mentor.dto';

@Injectable()
export class MentorsService {
  createUser(user: CreateMentorDto) {
    console.log('Create mentor', user);
    return { id: 1, username: 'nakkim' };
  }
  findByIntra(intraId: string) {
    // 찾아서 없으면
    return null;
  }
}
