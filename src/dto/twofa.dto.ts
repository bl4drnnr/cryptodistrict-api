import { TwoFa } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TwoFaDto implements TwoFa {
  @ApiProperty()
  id: string;
  @ApiProperty()
  twoFaToken: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  createdAt: Date;
}
