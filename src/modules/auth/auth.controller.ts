import { AuthService } from '@auth/auth.service';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Cookie } from '@decorators/cookie.decorator';
import { Response } from 'express';
import { RefreshTokenResponse } from '@auth/dto/refresh-token/response.dto';
import { CheckTokenDto } from '@auth/dto/check-token/request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/refresh')
  async refreshToken(
    @Cookie('_rt') refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const { _rt, _at } = await this.authService.refreshToken(refreshToken);

    res.cookie('_rt', _rt);

    return new RefreshTokenResponse(_at);
  }

  @Post('/check')
  async checkToken(
    @Cookie('_rt') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
    @Body() test: CheckTokenDto
  ) {
    //
  }
}
