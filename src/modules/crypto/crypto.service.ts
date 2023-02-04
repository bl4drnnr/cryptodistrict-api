import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { PrismaService } from '@shared/prisma.service';
import { HttpService } from '@shared/http.service';

@Injectable()
export class CryptoService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService
  ) {}

  async getAllCoins({ page, limit }: { page: string; limit: string }) {
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
  }

  async getCoinByName({ name }: { name: string }) {
    //
  }
}
