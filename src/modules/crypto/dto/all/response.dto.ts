interface ICoin {
  name: string;
}

export class GetAllCoinsResponse {
  constructor(coins: ICoin[]) {
    this.coins = coins;
  }

  private readonly coins: ICoin[];
}
