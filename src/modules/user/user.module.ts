import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { UserController } from '@user/user.controller';
import { UserService } from '@user/user.service';
import { AuthService } from '@auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  imports: [forwardRef(() => AuthModule), JwtModule],
  providers: [UserService, AuthService],
  exports: [UserService]
})
export class UserModule {}
