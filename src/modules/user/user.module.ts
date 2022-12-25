import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '@prisma/prisma.service';
import { AuthService } from '@auth/auth.service';

@Module({
  controllers: [UserController],
  imports: [forwardRef(() => AuthModule)],
  providers: [UserService, PrismaService, AuthService],
  exports: [UserService]
})
export class UserModule {}
