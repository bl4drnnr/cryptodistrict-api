import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [forwardRef(() => AuthModule)],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
