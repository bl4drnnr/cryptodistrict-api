import { FavoriteCoins } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FavoriteCoinsDto implements FavoriteCoins {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  cryptocurrencyId: string;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  createdAt: Date;
}
