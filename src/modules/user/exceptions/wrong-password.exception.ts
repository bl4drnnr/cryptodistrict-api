import { ForbiddenException } from '@nestjs/common';

export class WrongPasswordException extends ForbiddenException {
  constructor() {
    super('wrong-password', 'Wrong password');
  }
}
