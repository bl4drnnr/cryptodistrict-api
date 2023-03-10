import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { PrismaService } from '@shared/prisma.service';
import { HttpService } from '@shared/http.service';
import {
  CoinNotFoundException,
  NoUserCoinException
} from '@crypto/exceptions/crypto-exceptions.export';

@Injectable()
export class CryptoService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService
  ) {}

  async getAllCoins({
    page,
    limit,
    sort
  }: {
    page: string;
    limit: string;
    sort: string;
  }) {
    let orderBy: object;

    switch (sort) {
      case 'sortByName':
        orderBy = { name: 'asc' };
        break;
      case 'sortByTier':
        orderBy = { tier: 'asc' };
        break;
      case 'sortByRank':
        orderBy = { rank: 'asc' };
        break;
      case 'sortByCap':
        orderBy = { marketCap: 'asc' };
        break;
      default:
        orderBy = { name: 'asc' };
        break;
    }

    const coinsCount = await this.prisma.cryptocurrency.findMany();

    const coins = await this.prisma.cryptocurrency.findMany({
      orderBy,
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    });

    return { coins, count: coinsCount.length };
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
      description: coin.description || '',
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
    const coin = await this.prisma.cryptocurrency.findFirst({
      where: { id: cryptocurrencyId }
    });

    if (!coin) throw new CoinNotFoundException();

    const userFavoriteCoin = await this.prisma.favoriteCoins.findFirst({
      where: { userId, cryptocurrencyId }
    });

    if (!userFavoriteCoin) throw new NoUserCoinException();

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
