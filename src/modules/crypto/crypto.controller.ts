import { CryptoService } from '@crypto/crypto.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  GetAllCoinsRequest,
  GetAllCoinsResponse,
  GetCoinByNameRequest,
  GetCoinByNameResponse,
  AddToFavoriteRequest,
  AddToFavoriteResponse,
  RemoveFromFavoriteRequest,
  RemoveFromFavoriteResponse,
  AllFavoritesResponse
} from '@crypto/dto/crypto-dtos.export';
import { CryptocurrencyDto } from '@dto/cryptocurrency.dto';
import { JwtGuard } from '@guards/jwt.guard';
import { UserDecorator } from '@decorators/user.decorator';
import { FavoriteCoinsDto } from '@dto/favorite-coins.dto';

@ApiTags('Cryptocurrencies')
@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @ApiExtraModels(CryptocurrencyDto)
  @Get('all/:page/:limit')
  async getAllCryptocurrencies(@Param() { page, limit }: GetAllCoinsRequest) {
    const allCoins = await this.cryptoService.getAllCoins({ page, limit });

    return new GetAllCoinsResponse(allCoins);
  }

  @Get('coin/:name')
  async getCoinByName(@Param() { name }: GetCoinByNameRequest) {
    const coin = await this.cryptoService.getCoinByName({ name });

    return new GetCoinByNameResponse(coin);
  }

  @Post('favorite/add')
  @UseGuards(JwtGuard)
  async addToFavorite(
    @Body() { cryptocurrencyId }: AddToFavoriteRequest,
    @UserDecorator() userId: string
  ) {
    await this.cryptoService.addToFavorite({ cryptocurrencyId, userId });

    return new AddToFavoriteResponse();
  }

  @Post('favorite/remove')
  @UseGuards(JwtGuard)
  async removeFromFavorite(
    @Body() { cryptocurrencyId }: RemoveFromFavoriteRequest,
    @UserDecorator() userId: string
  ) {
    await this.cryptoService.removeFromFavorite({ cryptocurrencyId, userId });

    return new RemoveFromFavoriteResponse();
  }

  @ApiExtraModels(FavoriteCoinsDto)
  @Get('all-favorites')
  @UseGuards(JwtGuard)
  async getAllFavorites(@UserDecorator() userId: string) {
    const allFavorites = await this.cryptoService.getAllFavorites({ userId });

    // return new AllFavoritesResponse(allFavorites);
  }
}
