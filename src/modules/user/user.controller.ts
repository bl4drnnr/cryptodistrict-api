import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  Headers
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { UserDecorator } from '@decorators/user.decorator';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ConfirmHashDto } from '@dto/confirm-hash.dto';
import { TwoFaDto } from '@dto/twofa.dto';
import { UserDto } from '@dto/user.dto';
import {
  LogoutResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  GetSettingsRequest,
  GetSettingsResponse
} from './dto/user-dtos.export';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiExtraModels(TwoFaDto)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() payload: SignInRequest
  ) {
    const { _at, _rt } = await this.userService.singIn(payload);

    res.cookie('_rt', _rt);

    return new SignInResponse(_at);
  }

  @ApiExtraModels(UserDto)
  @Post('sign-up')
  async signUp(@Body() payload: SignUpRequest) {
    await this.userService.signUp(payload);

    return new SignUpResponse();
  }

  @Post('logout')
  async logout(
    @UserDecorator({ passthrough: true }) userId: string,
    @Res() res: Response
  ) {
    res.clearCookie('_rt');
    await this.userService.logout(userId);

    return new LogoutResponse();
  }

  @ApiExtraModels(ConfirmHashDto)
  @Get('account-confirmation/:confirmHash')
  accountConfirmation(@Param('confirmHash') confirmHash: string) {
    return this.userService.accountConfirmation({ confirmHash });
  }

  @Get('get-settings')
  async getSettings(@Headers() payload: GetSettingsRequest) {
    const userSettings = await this.userService.getSettings(payload);

    return new GetSettingsResponse(userSettings);
  }
}
