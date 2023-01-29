import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { SignInRequest } from './dto/sign-in/request.dto';
import { SignUpRequest } from './dto/sign-up/request.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { SignInResponse } from '@user/dto/sign-in/response.dto';
import { SignUpResponse } from '@user/dto/sign-up/response.dto';
import { UserDecorator } from '@decorators/user.decorator';
import { LogoutResponse } from '@user/dto/logout/response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() payload: SignInRequest
  ) {
    const { _at, _rt } = await this.userService.singIn(payload);

    res.cookie('_rt', _rt);

    return new SignInResponse(_at);
  }

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

  @Get('account-confirmation/:confirmHash')
  accountConfirmation(@Param('confirmHash') confirmHash: string) {
    return this.userService.accountConfirmation({ confirmHash });
  }
}
