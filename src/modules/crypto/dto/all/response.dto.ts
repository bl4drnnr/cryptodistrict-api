import { CryptocurrencyDto } from '@dto/cryptocurrency.dto';

export class GetAllCoinsResponse {
  constructor(coins: CryptocurrencyDto[], count: number) {
    this.coins = coins;
    this.count = count;
  }

  private readonly coins: CryptocurrencyDto[];
  private readonly count: number;
}
