import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ApiConfigService) {
    SendGrid.setApiKey(this.configService.sendGridApiKey);
  }

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
