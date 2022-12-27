import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { PrismaService } from '@shared/prisma.service';
import { EmailService } from '@shared/email.service';
import { LoggerService } from '@shared/logger.service';

const providers = [
  ApiConfigService,
  PrismaService,
  EmailService,
  LoggerService
];

@Global()
@Module({
  providers,
  exports: [...providers]
})
export class SharedModule {}
