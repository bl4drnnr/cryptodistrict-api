import { Injectable } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import { ApiConfigService } from '@shared/config.service';
import 'winston-daily-rotate-file';
import 'winston-mongodb';

@Injectable()
export class LoggerService {
  constructor(private readonly configService: ApiConfigService) {}

  loggerInstance(fileName = 'cryptodistrict-api') {
    const fileLogTransport = new transports.DailyRotateFile({
      filename: `logs/${fileName}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD HH:mm:ss',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    });

    const mongoDbTransport = new transports.MongoDB({
      level: 'error',
      db: this.configService.mongoDbUrl,
      options: {
        useUnifiedTopology: true
      },
      collection: 'cryptodistrict-api-logs'
    });

    return createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.printf(
          ({ level, message, label = this.configService.nodeEnv, timestamp }) =>
            `${timestamp} [${label}] ${level}: ${message}`
        )
      ),
      defaultMeta: { service: 'cryptodistrict-api' },
      transports: [mongoDbTransport, fileLogTransport]
    });
  }
}
