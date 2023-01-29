import { Sessions } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SessionDto implements Sessions {
  @ApiProperty()
  id: string;
  @ApiProperty()
  tokenId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  createdAt: Date;
}
