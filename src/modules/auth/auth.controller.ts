import { AuthService } from '@auth/auth.service';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Cookie } from '@decorators/cookie.decorator';
import { Response } from 'express';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { SessionDto } from '@dto/session.dto';
import { FastifyReply } from 'fastify';
import {
  RefreshTokenResponse,
  CheckTokenRequest
} from './dto/auth-dtos.export';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiExtraModels(SessionDto)
  @Get('/refresh')
  async refreshToken(
    @Res({ passthrough: true }) res: FastifyReply,
    @Cookie('_rt') refreshToken: string
  ) {
    const { _rt, _at } = await this.authService.refreshToken(refreshToken);

    res.cookie('_rt', _rt);

    return new RefreshTokenResponse(_at);
  }

  @ApiExtraModels(SessionDto)
  @Post('/check')
  async checkToken(
    @Cookie('_rt') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
    @Body() checkTokenRequest: CheckTokenRequest
  ) {
    //
  }
}
