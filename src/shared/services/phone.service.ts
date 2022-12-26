import { TwilioService } from 'nestjs-twilio';
import { ApiConfigService } from '@shared/config.service';

export class PhoneService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly configService: ApiConfigService
  ) {}

  async sendSmsCode({ targetPhoneNumber }: { targetPhoneNumber: string }) {
    return this.twilioService.client.messages.create({
      body: 'SMS Body, sent to the phone!',
      from: this.configService.twilioPhoneNumber,
      to: targetPhoneNumber
    });
  }
}
