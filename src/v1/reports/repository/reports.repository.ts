import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Reports } from '../../entities/reports.entity';

export class ReportsRepository extends Repository<Reports> {
  async findById(reportId: string): Promise<Reports> {
    let report: Reports;
    try {
      report = await this.findOne({
        where: { id: reportId },
        relations: {
          cadets: true,
          mentors: true,
        },
        select: {
          cadets: { name: true },
          mentors: { name: true },
        },
      });
    } catch {
      throw new ConflictException('레포트를 찾는중 오류가 발생하였습니다');
    }
    if (!report) {
      throw new NotFoundException(`해당 레포트를 찾을 수 없습니다`);
    }
    return report;
  }

  async findWithMentoringLogsById(reportId: string): Promise<Reports> {
    let report: Reports;
    try {
      report = await this.findOne({
        where: { id: reportId },
        relations: {
          mentoringLogs: {
            cadets: true,
            mentors: true,
          },
        },
        select: {
          mentoringLogs: {
            cadets: {
              name: true,
            },
            mentors: { name: true },
          },
        },
      });
    } catch {
      throw new ConflictException('레포트를 찾는중 오류가 발생하였습니다');
    }
    if (!report) {
      throw new NotFoundException(`해당 레포트를 찾을 수 없습니다`);
    }
    return report;
  }
}
