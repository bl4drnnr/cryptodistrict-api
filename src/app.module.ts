import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { SharedModule } from '@shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { BasicAuthMiddleware } from '@middlewares/basic-auth.middleware';
import { TwilioModule } from 'nestjs-twilio';
import { ApiConfigService } from '@shared/config.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SharedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TwilioModule.forRootAsync({
      useFactory: (cfg: ApiConfigService) => ({
        accountSid: cfg.twilioCredentials.twilio_account_sid,
        authToken: cfg.twilioCredentials.twilio_auth_token
      }),
      inject: [ApiConfigService]
    })
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BasicAuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    });
  }
}
