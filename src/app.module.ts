import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { PrismaModule } from '@prisma/prisma.module';
import { SharedModule } from '@shared/shared.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    SharedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    })
  ]
})
export class AppModule {}
