import { AuthService } from '@auth/auth.service';
import { Controller, Res } from '@nestjs/common';
import { Cookie } from '@decorators/cookie.decorator';
import { Response } from 'express';
import { RefreshTokenResponse } from '@auth/dto/refresh-token/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async refreshToken(
    @Cookie('_rt') refreshToken: string,
    @Res() res: Response
  ) {
    const { _rt, _at } = await this.authService.refreshToken(refreshToken);

    res.cookie('_rt', _rt);

    return new RefreshTokenResponse(_at);
  }
}
