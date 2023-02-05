import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { PrismaService } from '@shared/prisma.service';
import { HttpService } from '@shared/http.service';
import { CoinNotFoundException } from '@crypto/exceptions/crypto-exceptions.export';

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
    const coin = await this.prisma.cryptocurrency.findFirst({
      where: { name }
    });

    if (!coin.description || !coin.websiteUrl) {
      // do request here and write to database
    }

    return {
      ...coin,
      description: coin.description || 'asd',
      websiteUrl: coin.websiteUrl || ''
    };
  }

  async addToFavorite({
    cryptocurrencyId,
    userId
  }: {
    cryptocurrencyId: string;
    userId: string;
  }) {
    const coin = await this.prisma.cryptocurrency.findFirst({
      where: { id: cryptocurrencyId }
    });

    if (!coin) throw new CoinNotFoundException();

    return await this.prisma.favoriteCoins.create({
      data: { userId, cryptocurrencyId: coin.id }
    });
  }

  async removeFromFavorite({
    cryptocurrencyId,
    userId
  }: {
    cryptocurrencyId: string;
    userId: string;
  }) {
    return await this.prisma.favoriteCoins.delete({
      where: { userId, cryptocurrencyId }
    });
  }

  async getAllFavorites({ userId }: { userId: string }) {
    const userFavoriteCoins = await this.prisma.favoriteCoins.findMany({
      where: { userId },
      include: { cryptocurrency: true }
    });
  }
}
