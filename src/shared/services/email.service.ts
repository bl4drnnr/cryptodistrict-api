import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import * as SendGrid from '@sendgrid/mail';
import { LoggerService } from '@shared/logger.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly loggerService: LoggerService
  ) {
    SendGrid.setApiKey(this.configService.sendGridCredentials.api_key);
  }

  async sendConfirmationEmail({
    target,
    confirmHash
  }: {
    target: string;
    confirmHash: string;
  }) {
    const confirmationLink = `${this.configService.frontEndUrl}/account-confirmation/${confirmHash}`;

    const mail = {
      to: target,
      subject: 'Welcome to Cryptodistrict, cryptogeek!',
      from: this.configService.sendGridCredentials.sender_email,
      html: `
        <h1>Welcome to Cryptodistrict, cryptogeek, it's nice to see you</h1>
        <br>
        <p>Click <a href="${confirmationLink}">here</a> in order to confirm registration.</p>
        <br>
        <p>If link doesn't work, copy this and paste in browser.</p>
        <p>${confirmationLink}</p>
      `
    };

    const transport = await SendGrid.send(mail);

    this.loggerService
      .loggerInstance()
      .log('log', `Confirmation email has been sent (${confirmHash})`);

    return transport;
  }
}
