import { Body, Controller, Post } from '@nestjs/common';
import { PhoneService } from '@phone/phone.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { PhoneDto } from '@dto/phone.dto';
import { VerificationCodeDto } from '@dto/verification-code.dto';
import {
  SetPhoneRequest,
  SetPhoneResponse,
  RemovePhoneRequest,
  RemovePhoneResponse,
  VerifyPhoneRequest,
  VerifyPhoneResponse
} from './dto/phone-dtos.export';

@ApiTags('Phone')
@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @ApiExtraModels(PhoneDto, VerificationCodeDto)
  @Post('set')
  async setPhone(@Body() payload: SetPhoneRequest) {
    await this.phoneService.setMobilePhoneNumber(payload);

    return new SetPhoneResponse();
  }

  @Post('remove')
  async removePhone(@Body() payload: RemovePhoneRequest) {
    await this.phoneService.removeMobilePhoneNumber(payload);

    return new RemovePhoneResponse();
  }

  @Post('verify')
  async verifyPhone(@Body() payload: VerifyPhoneRequest) {
    await this.phoneService.verifyMobilePhoneNumber(payload);

    return new VerifyPhoneResponse();
  }
}
