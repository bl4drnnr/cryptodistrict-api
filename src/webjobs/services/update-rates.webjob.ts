import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerService } from '@shared/logger.service';
import { HttpService } from '@shared/http.service';
import { PrismaService } from '@shared/prisma.service';
import { ApiConfigService } from '@shared/config.service';

@Injectable()
export class UpdateRatesWebjob {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly configService: ApiConfigService
  ) {}

  @Cron('0 10 * * * *')
  async handleCron() {
    const cryptocurrencies = await this.httpService.sendRequest({
      endpoint: 'coins',
      url: this.configService.coinrankingCredentials.url,
      headers: {
        'X-RapidAPI-Key': this.configService.coinrankingCredentials.key,
        'X-RapidAPI-Host': this.configService.coinrankingCredentials.host
      },
      params: {
        referenceCurrencyUuid: 'yhjMzLPhuIDl',
        timePeriod: '24h',
        'tiers[0]': '1',
        orderBy: 'marketCap',
        orderDirection: 'desc',
        limit: '50',
        offset: '0'
      }
    });

    this.loggerService
      .loggerInstance()
      .log('warn', `Crypto rates have been updated successfully.`);
  }
}
