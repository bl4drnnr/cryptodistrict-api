import { Module } from '@nestjs/common';
import { CryptoService } from '@crypto/crypto.service';
import { CryptoController } from '@crypto/crypto.controller';

@Module({
  providers: [CryptoService],
  exports: [CryptoService],
  controllers: [CryptoController]
})
export class CryptoModule {}
