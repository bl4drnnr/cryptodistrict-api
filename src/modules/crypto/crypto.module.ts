import { forwardRef, Module } from '@nestjs/common';
import { CryptoService } from '@crypto/crypto.service';
import { CryptoController } from '@crypto/crypto.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@auth/auth.service';
import { UserModule } from '@user/user.module';

@Module({
  controllers: [CryptoController],
  imports: [forwardRef(() => UserModule), JwtModule],
  providers: [CryptoService, AuthService],
  exports: [CryptoService]
})
export class CryptoModule {}
