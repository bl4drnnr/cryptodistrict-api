import { BadRequestException } from '@nestjs/common';

export class CoinNotFoundException extends BadRequestException {
  constructor() {
    super('coin-not-found', 'Coin not found');
  }
}
