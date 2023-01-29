import { VerificationCodes } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class VerificationCodeDto implements VerificationCodes {
  @ApiProperty()
  id: string;
  @ApiProperty()
  verificationCode: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  confirmed: boolean;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  createdAt: Date;
}
