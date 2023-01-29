import { ConfirmationHashes } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmHashDto implements ConfirmationHashes {
  @ApiProperty()
  id: string;
  @ApiProperty()
  confirmHash: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  confirmed: boolean;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  createdAt: Date;
}
