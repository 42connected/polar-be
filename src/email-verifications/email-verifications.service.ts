import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestEmailDto } from 'src/v1/dto/email-verifications/email.dto';
import { EmailService } from 'src/v1/email/service/email.service';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Repository } from 'typeorm';

const EMAIL_TIME_LIMIT = 180;

@Injectable()
export class EmailVerificationService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager,
    @InjectRepository(Cadets) private cadetsRepository: Repository<Cadets>,
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
    private emailService: EmailService,
  ) {}

  async isDulicatedEmail(email: string) {
    const c = await this.cadetsRepository.findOne({
      where: { email: email },
    });
    if (c) {
      return true;
    }
    const m = await this.mentorsRepository.findOne({
      where: { email: email },
    });
    if (m) {
      return true;
    }
    return false;
  }

  async requestChangingEmail(intraId: string, req: RequestEmailDto) {
    if (await this.isDulicatedEmail(req.email)) {
      throw new ConflictException('사용중인 이메일입니다');
    }
    const data = await this.cacheManager.get(intraId);
    if (data) {
      await this.cacheManager.del([data, intraId]);
    }
    const code: string = Math.random().toString(36).substring(2, 10);
    try {
      await this.cacheManager.set(code, req.email, {
        ttl: EMAIL_TIME_LIMIT,
      });
      await this.cacheManager.set(intraId, code, {
        ttl: EMAIL_TIME_LIMIT,
      });
      await this.emailService.sendVerificationMail(intraId, code);
    } catch {
      throw new ConflictException('이메일 요청중 오류가 발생했습니다');
    }
    return 'ok';
  }

  async verifyMentorEmail(intraId: string, code: string) {
    const email = await this.cacheManager.get(code);
    if (!email) {
      throw new ConflictException('유효하지 않은 요청입니다');
    }
    try {
      await this.cacheManager.del(code);
      const mentor = await this.mentorsRepository.findOneBy({ intraId });
      mentor.email = email;
      await this.mentorsRepository.save(mentor);
    } catch {
      throw new ConflictException('이메일 수정중 오류가 발생했습니다');
    }
    return true;
  }
}
