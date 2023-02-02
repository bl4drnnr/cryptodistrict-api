import { Module } from '@nestjs/common';
import { TwofactorService } from './twofactor.service';
import { TwofactorController } from './twofactor.controller';

@Module({
  providers: [TwofactorService],
  controllers: [TwofactorController]
})
export class TwofactorModule {}
