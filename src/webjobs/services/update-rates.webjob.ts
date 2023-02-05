import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerService } from '@shared/logger.service';
import { HttpService } from '@shared/http.service';
import { PrismaService } from '@shared/prisma.service';
import { ApiConfigService } from '@shared/config.service';
import { CryptocurrencyDto } from '@dto/cryptocurrency.dto';

interface ICoinsDataStats {
  total: number;
  totalCoins: number;
  totalMarkets: number;
  totalExchanges: number;
  totalMarketCap: string;
  total24hVolume: string;
}

interface ICoinsData {
  stats: ICoinsDataStats;
  coins: CryptocurrencyDto[];
}

interface ICoinsResponse {
  status: string;
  data: ICoinsData;
}

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
    const cryptocurrencies: ICoinsResponse = await this.httpService.sendRequest(
      {
        endpoint: 'coins',
        url: this.configService.coinrankingCredentials.url,
        headers: {
          'X-RapidAPI-Key': this.configService.coinrankingCredentials.key,
          'X-RapidAPI-Host': this.configService.coinrankingCredentials.host
        },
        params: {
          referenceCurrencyUuid:
            this.configService.coinrankingCredentials.reference_currency_uuid,
          timePeriod: this.configService.coinrankingCredentials.time_period,
          limit: this.configService.coinrankingCredentials.limit,
          'tiers[0]': '1'
        }
      }
    );
    const coinsList = cryptocurrencies.data.coins;

    const filteredCoins = coinsList.map((o) => {
      return {
        ...o,
        Volume24h: o['24hVolume'],
        sparkline: o['sparkline'].toString()
      };
    });

    filteredCoins.forEach((item) => {
      delete item['24hVolume'];
      delete item['lowVolume'];
      delete item['color'];
      delete item['listedAt'];
    });

    filteredCoins.map(async (item) => {
      await this.prisma.cryptocurrency.upsert({
        where: { uuid: item.uuid },
        update: { ...item },
        create: { ...item }
      });
    });

    return this.loggerService
      .loggerInstance()
      .log('warn', `Crypto rates have been updated successfully.`);
  }
}
