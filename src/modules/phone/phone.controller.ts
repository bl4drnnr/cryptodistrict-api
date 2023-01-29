import { Controller, Post } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { PhoneDto } from '@dto/phone.dto';
import { VerificationCodeDto } from '@dto/verification-code.dto';

@ApiTags('Phone')
@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @ApiExtraModels(PhoneDto, VerificationCodeDto)
  @Post('confirm')
  confirm() {
    return 0;
  }
}
