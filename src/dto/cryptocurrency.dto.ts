import { Cryptocurrency } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CryptocurrencyDto implements Cryptocurrency {
  @ApiProperty()
  id: string;
  @ApiProperty()
  uuid: string;
  @ApiProperty()
  symbol: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  iconUrl: string;
  @ApiProperty()
  websiteUrl: string;
  @ApiProperty()
  Volume24h: string;
  @ApiProperty()
  marketCap: string;
  @ApiProperty()
  price: string;
  @ApiProperty()
  btcPrice: string;
  @ApiProperty()
  change: string;
  @ApiProperty()
  rank: number;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  createdAt: Date;
}
