import { ForbiddenException } from '@nestjs/common';

export class UserAlreadyExistsException extends ForbiddenException {
  constructor() {
    super('userAlreadyExists', 'User already exists');
  }
}
