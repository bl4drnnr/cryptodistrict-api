import { Module } from '@nestjs/common';
import { UpdateRatesWebjob } from '@webjobs/services/update-rates.webjob';

const providers = [UpdateRatesWebjob];

@Module({
  providers
})
export class WebjobsModule {}
