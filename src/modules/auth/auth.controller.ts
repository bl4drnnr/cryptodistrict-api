import { AuthService } from '@auth/auth.service';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Cookie } from '@decorators/cookie.decorator';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { SessionDto } from '@dto/session.dto';
import { FastifyReply } from 'fastify';
import { RefreshTokenResponse } from './dto/auth-dtos.export';
import { JwtGuard } from '@guards/jwt.guard';
import { UserDecorator } from '@decorators/user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiExtraModels(SessionDto)
  @Get('/refresh')
  @UseGuards(JwtGuard)
  async refreshToken(
    @Res({ passthrough: true }) res: FastifyReply,
    @Cookie('_rt') refreshToken: string,
    @UserDecorator() userId: string
  ) {
    const { _rt, _at, userData } = await this.authService.refreshToken(
      refreshToken
    );

    res.cookie('_rt', _rt);

    return new RefreshTokenResponse(_at, userData);
  }
}
