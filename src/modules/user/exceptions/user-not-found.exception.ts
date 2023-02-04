import { BadRequestException } from '@nestjs/common';

export class UserNotFoundException extends BadRequestException {
  constructor() {
    super('user-not-found', 'User not found');
  }
}
