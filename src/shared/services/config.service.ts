import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv() {
    return this.getString('NODE_ENV');
  }

  get mongoDbUrl() {
    return this.getString('MONGO_DB');
  }

  get databaseUrl() {
    return {
      url: this.getString('DATABASE_URL')
    };
  }

  get basicAuthConfig() {
    return {
      username: this.getString('BASIC_AUTH_USERNAME'),
      password: this.getString('BASIC_AUTH_PASSWORD')
    };
  }

  get twilioCredentials() {
    return {
      twilio_auth_phone: this.getString('TWILIO_AUTH_PHONE'),
      twilio_account_sid: this.getString('TWILIO_ACCOUNT_SID'),
      twilio_auth_token: this.getString('TWILIO_AUTH_TOKEN')
    };
  }

  get sendGridCredentials() {
    return {
      api_key: this.getString('SENDGRID_API_KEY'),
      sender_email: this.getString('SENDGRID_SENDER_EMAIL')
    };
  }

  get jwtAuthConfig() {
    return {
      accessExpiresIn: this.getString('JWT_ACCESS_EXPIRES_IN'),
      refreshExpiresIn: this.getString('JWT_REFRESH_EXPIRES_IN'),
      secret: this.getString('JWT_SECRET')
    };
  }

  get frontEndUrl() {
    return this.getString('FRONT_END_URL');
  }
}
