import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { PrismaService } from '@shared/prisma.service';
import { EmailService } from '@shared/email.service';
import { PhoneService } from '@shared/phone.service';
import { TwilioService } from 'nestjs-twilio';

const providers = [
  ApiConfigService,
  PrismaService,
  EmailService,
  PhoneService,
  TwilioService
];

@Global()
@Module({
  providers,
  exports: [...providers]
})
export class SharedModule {}
