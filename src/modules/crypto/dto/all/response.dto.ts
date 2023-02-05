import { CryptocurrencyDto } from '@dto/cryptocurrency.dto';

export class GetAllCoinsResponse {
  constructor(coins: CryptocurrencyDto[]) {
    this.coins = coins;
  }

  private readonly coins: CryptocurrencyDto[];
}
