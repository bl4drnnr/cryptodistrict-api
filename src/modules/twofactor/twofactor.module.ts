import { forwardRef, Module } from '@nestjs/common';
import { TwofactorService } from './twofactor.service';
import { TwofactorController } from './twofactor.controller';
import { AuthModule } from '@auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => AuthModule), JwtModule],
  providers: [TwofactorService],
  controllers: [TwofactorController],
  exports: [TwofactorService]
})
export class TwofactorModule {}
