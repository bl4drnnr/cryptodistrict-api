import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/config.service';
import { IAccessToken } from '@interfaces/access-token.interface';
import { IRefreshToken } from '@interfaces/refresh-token.interface';
import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';
import { ITokenPayload } from '@interfaces/token-payload.interface';
import { ITokenError } from '@interfaces/token-error.interface';
import { CorruptedTokenException } from '@auth/exceptions/corrupted-token.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService
  ) {}

  private generateAccessToken(IAccessToken: IAccessToken) {
    const payload = {
      userId: IAccessToken.userId,
      email: IAccessToken.email,
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

  private async updateRefreshToken(IRefreshToken: IRefreshToken) {
    const currentSession = await this.prisma.sessions.findFirst({
      where: { userId: IRefreshToken.userId }
    });
    if (currentSession) {
      await this.prisma.sessions.delete({
        where: { id: currentSession.id }
      });
    }

    return await this.prisma.sessions.create({
      data: IRefreshToken
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

  async updateTokens(IAccessToken: IAccessToken) {
    const accessToken = this.generateAccessToken(IAccessToken);
    const refreshToken = this.generateRefreshToken();

    await this.updateRefreshToken({
      userId: IAccessToken.userId,
      tokenId: refreshToken.id
    });

    return { _at: accessToken, _rt: refreshToken.token };
  }

  async refreshToken(tokenRefresh: string) {
    if (!tokenRefresh) throw new CorruptedTokenException();

    const payload: ITokenPayload | ITokenError =
      this.verifyToken(tokenRefresh);

    if (!('type' in payload)) throw new CorruptedTokenException();

    const token = await this.getTokenById(payload.id);

    if (!token) throw new CorruptedTokenException();

    const user = await this.prisma.users.findFirst({
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

  async checkToken() {
    //
  }
}
