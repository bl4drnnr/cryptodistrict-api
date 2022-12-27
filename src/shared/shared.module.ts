import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { PrismaService } from '@shared/prisma.service';
import { EmailService } from '@shared/email.service';

const providers = [ApiConfigService, PrismaService, EmailService];

@Global()
@Module({
  providers,
  exports: [...providers]
})
export class SharedModule {}
