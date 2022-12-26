import { ForbiddenException } from '@nestjs/common';

export class PhoneAlreadyConfirmedException extends ForbiddenException {
  constructor() {
    super('phone-already-confirmed', 'Phone number already confirmed');
  }
}
