import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
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

  async isDulicatedEmail(email: string): Promise<boolean> {
    const cadet = await this.cadetsRepository.findOne({
      where: { email: email },
    });
    if (cadet) {
      return true;
    }
    const mentor = await this.mentorsRepository.findOne({
      where: { email: email },
    });
    if (mentor) {
      return true;
    }
    return false;
  }

  async requestChangingEmail(
    intraId: string,
    req: RequestEmailDto,
  ): Promise<boolean> {
    if (await this.isDulicatedEmail(req.email)) {
      throw new ConflictException('사용중인 이메일입니다');
    }
    /*
     * Random code generator
     */
    const code: string = Math.random().toString(36).substring(2, 10);
    try {
      /*
       * 동일한 Intra ID의 요청 제거 on Redis 후, 새 요청 Set
       */
      const oldValue = await this.cacheManager.get(intraId);
      if (oldValue) {
        await this.cacheManager.del([oldValue, intraId]);
      }
      await this.cacheManager.set(code, req.email, {
        ttl: EMAIL_TIME_LIMIT,
      });
      await this.cacheManager.set(intraId, code, {
        ttl: EMAIL_TIME_LIMIT,
      });
    } catch {
      throw new ConflictException(`이메일 요청중 오류가 발생했습니다`);
    }
    await this.emailService.sendVerificationMail(code, req.email);
    return true;
  }

  async verifyMentorEmail(intraId: string, code: string): Promise<boolean> {
    const email = await this.cacheManager.get(code);
    if (!email) {
      throw new ConflictException('유효하지 않은 요청입니다');
    }
    try {
      /*
       * 요청 삭제 on Redis
       */
      await this.cacheManager.del([code, intraId]);
      const mentor = await this.mentorsRepository.findOneBy({ intraId });
      if (!mentor) {
        throw new NotFoundException('해당 멘토를 찾을 수 없습니다');
      }
      mentor.email = email;
      await this.mentorsRepository.save(mentor);
    } catch {
      throw new ConflictException(`이메일 수정중 오류가 발생했습니다`);
    }
    return true;
  }
}
