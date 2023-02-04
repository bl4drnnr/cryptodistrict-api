interface ICoin {
  name: string;
}

export class GetCoinByNameResponse {
  constructor(coin: ICoin) {
    this.coin = coin;
  }

  private readonly coin: ICoin;
}
