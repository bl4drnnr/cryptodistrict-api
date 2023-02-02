import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TwofactorService } from '@twofactor/twofactor.service';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { TwoFaDto } from '@dto/twofa.dto';
import {
  SetTwoFaRequest,
  SetTwoFaResponse,
  RemoveTwoFaRequest,
  RemoveTwoFaResponse
} from './dto/twofactor-dtos.export';
import { JwtGuard } from '@guards/jwt.guard';

@ApiTags('2FA')
@Controller('twofactor')
export class TwofactorController {
  constructor(private readonly twofactorService: TwofactorService) {}

  @ApiExtraModels(TwoFaDto)
  @Post('set')
  @UseGuards(JwtGuard)
  async setTwoFa(@Body() payload: SetTwoFaRequest) {
    await this.twofactorService.setUpTwoFa(payload);

    return new SetTwoFaResponse();
  }

  @Post('remove')
  @UseGuards(JwtGuard)
  async removeTwoFa(@Body() payload: RemoveTwoFaRequest) {
    await this.twofactorService.removeTwoFa(payload);

    return new RemoveTwoFaResponse();
  }
}
