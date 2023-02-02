import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
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
  GetSettingsResponse
} from './dto/user-dtos.export';
import { JwtGuard } from '@guards/jwt.guard';
import { FastifyReply } from 'fastify';
import { CloseAccountResponse } from '@user/dto/close-account/response.dto';
import { FreezeAccountResponse } from '@user/dto/freeze-account/response.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiExtraModels(TwoFaDto)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: FastifyReply,
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
  @UseGuards(JwtGuard)
  async logout(
    @UserDecorator() userId: string,
    @Res({ passthrough: true }) res: FastifyReply
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
  @UseGuards(JwtGuard)
  async getSettings(@UserDecorator() userId: string) {
    const userSettings = await this.userService.getSettings(userId);

    return new GetSettingsResponse(userSettings);
  }

  @Post('freeze-account')
  @UseGuards(JwtGuard)
  async freezeAccount(@UserDecorator() userId: string) {
    await this.userService.freezeAccount(userId);

    return new FreezeAccountResponse();
  }

  @Post('close-account')
  @UseGuards(JwtGuard)
  async closeAccount(@UserDecorator() userId: string) {
    await this.userService.closeAccount(userId);

    return new CloseAccountResponse();
  }
}
