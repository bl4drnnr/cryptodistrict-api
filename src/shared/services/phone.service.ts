import { TwilioService } from 'nestjs-twilio';
import { ApiConfigService } from '@shared/config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PhoneService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly configService: ApiConfigService
  ) {}

  async sendSmsCode({ targetPhoneNumber }: { targetPhoneNumber: string }) {
    const verificationCode = Math.round(Math.random() * 1000000);
    return this.twilioService.client.messages.create({
      body: `Cryptodistrict verification code: ${verificationCode}.\nWill be valid for 5 minutes.`,
      from: this.configService.twilioCredentials.twilio_auth_phone,
      to: targetPhoneNumber
    });
  }
}
