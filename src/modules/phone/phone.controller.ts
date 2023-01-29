import { Body, Controller, Post } from '@nestjs/common';
import { PhoneService } from '@phone/phone.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { PhoneDto } from '@dto/phone.dto';
import { VerificationCodeDto } from '@dto/verification-code.dto';
import {
  PhoneConfirmationRequest,
  PhoneConfirmationResponse,
  UnbindPhoneRequest,
  UnbindPhoneResponse,
  VerifyPhoneRequest,
  VerifyPhoneResponse
} from './dto/phone-dtos.export';

@ApiTags('Phone')
@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Post('unbind')
  async unbindPhone(@Body() payload: UnbindPhoneRequest) {
    await this.phoneService.unbindMobilePhoneNumber(payload);

    return new UnbindPhoneResponse();
  }

  @ApiExtraModels(PhoneDto, VerificationCodeDto)
  @Post('confirm')
  async confirmPhone(@Body() payload: PhoneConfirmationRequest) {
    await this.phoneService.confirmMobilePhoneNumber(payload);

    return new PhoneConfirmationResponse();
  }

  @Post('verify')
  async verifyPhone(@Body() payload: VerifyPhoneRequest) {
    await this.phoneService.verifyMobilePhoneNumber(payload);

    return new VerifyPhoneResponse();
  }
}
