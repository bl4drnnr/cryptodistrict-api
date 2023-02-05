import { CryptocurrencyDto } from '@dto/cryptocurrency.dto';

export class AllFavoritesResponse {
  constructor(coins: CryptocurrencyDto[]) {
    this.coins = coins;
  }
  coins: CryptocurrencyDto[];
}
