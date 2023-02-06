import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';
import { TwilioService } from 'nestjs-twilio';
import { ApiConfigService } from '@shared/config.service';
import {
  VerifyPhoneRequest,
  SetPhoneRequest,
  RemovePhoneRequest
} from './dto/phone-dtos.export';

@Injectable()
export class PhoneService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly twilioService: TwilioService,
    private readonly configService: ApiConfigService
  ) {}

  async removeMobilePhoneNumber(unbindPhoneRequest: RemovePhoneRequest) {
    //
  }

  async verifyMobilePhoneNumber(verifyPhoneRequest: VerifyPhoneRequest) {
    //
  }

  async setMobilePhoneNumber(
    phoneConfirmationRequest: SetPhoneRequest
  ) {
    //
  }

  async sendSmsCode({ targetPhoneNumber }: { targetPhoneNumber: string }) {
    const verificationCode = Math.round(Math.random() * 1000000);

    return this.twilioService.client.messages.create({
      body: `Cryptodistrict verification code: ${verificationCode}.\nWill be valid for 5 minutes.`,
      from: this.configService.twilioCredentials.twilio_auth_phone,
      to: targetPhoneNumber
    });
  }
}
