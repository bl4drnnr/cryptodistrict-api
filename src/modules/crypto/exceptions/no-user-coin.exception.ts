import { BadRequestException } from "@nestjs/common";

export class NoUserCoinException extends BadRequestException {
  constructor() {
    super('no-user-coin', 'No user coin');
  }
}
