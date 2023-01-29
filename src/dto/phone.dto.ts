import { Phones } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PhoneDto implements Phones {
  @ApiProperty()
  id: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  createdAt: Date;
}
