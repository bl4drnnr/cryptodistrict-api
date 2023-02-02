import { CryptoService } from '@crypto/crypto.service';

export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}
}
