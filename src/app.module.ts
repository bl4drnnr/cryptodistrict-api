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

@Module({
  imports: [
    AuthModule,
    UserModule,
    SharedModule,
    PhoneModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
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
