import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { SharedModule } from '@shared/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BasicAuthMiddleware } from '@middlewares/basic-auth.middleware';
import { TwilioModule } from 'nestjs-twilio';

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
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        accountSid: cfg.get('TWILIO_ACCOUNT_SID'),
        authToken: cfg.get('TWILIO_AUTH_TOKEN')
      }),
      inject: [ConfigService]
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
