import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerService } from '@shared/logger.service';
import { HttpService } from '@shared/http.service';
import { PrismaService } from '@shared/prisma.service';

@Injectable()
export class UpdateRatesWebjob {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService
  ) {}

  @Cron('2 * * * * *')
  async handleCron() {
    this.loggerService
      .loggerInstance()
      .log('warn', `Crypto rates have been updated successfully.`);
  }
}
