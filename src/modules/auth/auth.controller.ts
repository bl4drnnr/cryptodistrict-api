import { AuthService } from '@auth/auth.service';
import { Controller, Get, Res } from '@nestjs/common';
import { Cookie } from '@decorators/cookie.decorator';
import { Response } from 'express';
import { RefreshTokenResponse } from '@auth/dto/refresh-token/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/refresh')
  async refreshToken(
    @Cookie('_rt') refreshToken: string,
    @Res() res: Response
  ) {
    const { _rt, _at } = await this.authService.refreshToken(refreshToken);

    res.cookie('_rt', _rt);

    return new RefreshTokenResponse(_at);
  }
}
