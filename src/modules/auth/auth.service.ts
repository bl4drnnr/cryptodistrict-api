import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/config.service';
import { IAccessToken } from '@auth/interfaces/access-token.interface';
import { IRefreshToken } from '@auth/interfaces/refresh-token.interface';
import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';
import { ITokenPayload } from '@auth/interfaces/token-payload.interface';
import { ITokenError } from '@auth/interfaces/token-error.interface';
import { CorruptedTokenException } from '@auth/exceptions/corrupted-token.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService
  ) {}

  private generateAccessToken(accessTokenDto: IAccessToken) {
    const payload = {
      userId: accessTokenDto.userId,
      email: accessTokenDto.email,
      type: 'access'
    };
    const options = {
      expiresIn: this.configService.jwtAuthConfig.accessExpiresIn,
      secret: this.configService.jwtAuthConfig.secret
    };

    return this.jwtService.sign(payload, options);
  }

  private generateRefreshToken() {
    const id = uuid.v4();
    const payload = { id, type: 'refresh' };
    const options = {
      expiresIn: this.configService.jwtAuthConfig.refreshExpiresIn,
      secret: this.configService.jwtAuthConfig.secret
    };

    return { id, token: this.jwtService.sign(payload, options) };
  }

  private async updateRefreshToken(refreshTokenDto: IRefreshToken) {
    await this.prisma.sessions.delete({
      where: { userId: refreshTokenDto.userId }
    });
    return await this.prisma.sessions.create({
      data: refreshTokenDto
    });
  }

  private verifyToken<T extends ITokenPayload, R extends ITokenError>(
    token: string
  ): T | R {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.jwtAuthConfig.secret
      });
    } catch (e: any) {
      if (e instanceof jwt.TokenExpiredError)
        return <R>{ message: 'token-expired' };
      else if (e instanceof jwt.JsonWebTokenError)
        return <R>{ message: 'invalid-token' };
    }
  }

  async getTokenById(tokenId: string) {
    return this.prisma.sessions.findFirst({
      where: { tokenId }
    });
  }

  async updateTokens(accessTokenDto: IAccessToken) {
    const accessToken = this.generateAccessToken(accessTokenDto);
    const refreshToken = this.generateRefreshToken();

    await this.updateRefreshToken({
      userId: accessTokenDto.userId,
      tokenId: refreshToken.id
    });

    return { _at: accessToken, _rt: refreshToken.token };
  }

  async refreshToken(tokenRefresh: string) {
    if (!tokenRefresh) throw new CorruptedTokenException();

    const payload: ITokenPayload | ITokenError = this.verifyToken(tokenRefresh);

    if (!('type' in payload)) throw new CorruptedTokenException();

    const token = await this.getTokenById(payload.id);

    if (!token) throw new CorruptedTokenException();

    const user = await this.prisma.user.findFirst({
      where: { id: token.userId }
    });

    return await this.updateTokens({
      userId: user.id,
      email: user.email
    });
  }

  async deleteRefreshToken(userId: string) {
    return await this.prisma.sessions.delete({ where: { userId } });
  }
}
