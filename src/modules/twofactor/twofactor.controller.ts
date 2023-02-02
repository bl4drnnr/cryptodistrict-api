import { Body, Controller, Post } from '@nestjs/common';
import { TwofactorService } from '@twofactor/twofactor.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { TwoFaDto } from '@dto/twofa.dto';
import {
  SetTwoFaRequest,
  SetTwoFaResponse,
  RemoveTwoFaRequest,
  RemoveTwoFaResponse
} from './dto/twofactor-dtos.export';

@ApiTags('2FA')
@Controller('twofactor')
export class TwofactorController {
  constructor(private readonly twofactorService: TwofactorService) {}

  @ApiExtraModels(TwoFaDto)
  @Post('set')
  async setTwoFa(@Body() payload: SetTwoFaRequest) {
    await this.twofactorService.setUpTwoFa(payload);

    return new SetTwoFaResponse();
  }

  @Post('remove')
  async removeTwoFa(@Body() payload: RemoveTwoFaRequest) {
    await this.twofactorService.removeTwoFa(payload);

    return new RemoveTwoFaResponse();
  }
}
