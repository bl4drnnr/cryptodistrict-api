import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { SignInDto } from './dto/sign-in/request.dto';
import { SignUpDto } from './dto/sign-up/request.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { SignInUserResponse } from '@user/dto/sign-in/response.dto';
import { SignUpUserResponse } from '@user/dto/sign-up/response.dto';
import { UserDecorator } from '@decorators/user.decorator';
import { LogoutResponse } from '@user/dto/logout/response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() payload: SignInDto
  ) {
    const { _at, _rt } = await this.userService.singIn(payload);

    res.cookie('_rt', _rt);

    return new SignInUserResponse(_at);
  }

  @Post('sign-up')
  async signUp(@Body() payload: SignUpDto) {
    await this.userService.signUp(payload);

    return new SignUpUserResponse();
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
