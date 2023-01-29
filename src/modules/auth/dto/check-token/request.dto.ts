import { ApiProperty } from '@nestjs/swagger';

export class CheckTokenDto {
  @ApiProperty()
  test: string;
}
