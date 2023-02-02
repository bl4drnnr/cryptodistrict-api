import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';
import { LoggerService } from '@shared/logger.service';
import {
  SetTwoFaRequest,
  RemoveTwoFaRequest
} from './dto/twofactor-dtos.export';
@Injectable()
export class TwofactorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggerService: LoggerService
  ) {}

  async setUpTwoFa(payload: SetTwoFaRequest) {
    //
  }

  async removeTwoFa(payload: RemoveTwoFaRequest) {
    //
  }
}
