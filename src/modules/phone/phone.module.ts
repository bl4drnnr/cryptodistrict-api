import { Module } from '@nestjs/common';
import { PhoneService } from '@phone/phone.service';
import { PhoneController } from '@phone/phone.controller';
import { ApiConfigService } from '@shared/config.service';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  providers: [PhoneService],
  controllers: [PhoneController],
  imports: [
    TwilioModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        accountSid: configService.twilioCredentials.twilio_account_sid,
        authToken: configService.twilioCredentials.twilio_auth_token
      }),
      inject: [ApiConfigService]
    })
  ]
})
export class PhoneModule {}
