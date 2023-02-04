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
import { PhoneModule } from '@phone/phone.module';
import { BasicAuthMiddleware } from '@middlewares/basic-auth.middleware';
import { TwofactorModule } from '@twofactor/twofactor.module';
import { CryptoModule } from '@crypto/crypto.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WebjobsModule } from '@webjobs/webjobs.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SharedModule,
    WebjobsModule,
    PhoneModule,
    CryptoModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TwofactorModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BasicAuthMiddleware).forRoutes({
      path: '/api/*',
      method: RequestMethod.ALL
    });
  }
}
