import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ApiConfigService) {}

  async sendConfirmationEmail({
    target,
    confirmHash
  }: {
    target: string;
    confirmHash: string;
  }) {
    return 0;
  }
}
