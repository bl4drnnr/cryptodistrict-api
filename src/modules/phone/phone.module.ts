import { Module } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { PhoneController } from './phone.controller';
import { ApiConfigService } from '@shared/config.service';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  providers: [PhoneService],
  controllers: [PhoneController],
  imports: [
    TwilioModule.forRootAsync({
      imports: [ApiConfigService],
      useFactory: (cfg: ApiConfigService) => ({
        accountSid: cfg.twilioCredentials.twilio_account_sid,
        authToken: cfg.twilioCredentials.twilio_auth_token
      }),
      inject: [ApiConfigService]
    })
  ]
})
export class PhoneModule {}
