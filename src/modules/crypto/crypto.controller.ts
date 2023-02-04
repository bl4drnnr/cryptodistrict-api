import { CryptoService } from '@crypto/crypto.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  GetAllCoinsRequest,
  GetAllCoinsResponse,
  GetCoinByNameRequest,
  GetCoinByNameResponse
} from '@crypto/dto/crypto-dtos.export';
import { CryptocurrencyDto } from '@dto/cryptocurrency.dto';

@ApiTags('Cryptocurrencies')
@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @ApiExtraModels(CryptocurrencyDto)
  @Get('all/:page/:limit')
  async getAllCryptocurrencies(@Param() { page, limit }: GetAllCoinsRequest) {
    const allCoins = await this.cryptoService.getAllCoins({ page, limit });

    // return new GetAllCoinsResponse(allCoins);
  }

  @Get('coin/:name')
  async getCoinByName(@Param() { name }: GetCoinByNameRequest) {
    const coin = await this.cryptoService.getCoinByName({ name });

    // return new GetCoinByNameResponse(coin);
  }
}
