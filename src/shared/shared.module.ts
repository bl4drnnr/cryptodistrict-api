import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { PrismaService } from '@shared/prisma.service';
import { EmailService } from '@shared/email.service';
import { LoggerService } from '@shared/logger.service';
import { ValidatorService } from '@shared/validator.service';
import { HttpService } from '@shared/http.service';
import { HttpModule } from '@nestjs/axios';

const providers = [
  ApiConfigService,
  PrismaService,
  EmailService,
  LoggerService,
  ValidatorService,
  HttpService
];

@Global()
@Module({
  providers,
  exports: [...providers],
  imports: [HttpModule]
})
export class SharedModule {}
