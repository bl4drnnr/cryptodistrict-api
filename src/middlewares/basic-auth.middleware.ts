import type { NestMiddleware } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';

import { ApiConfigService } from '@shared/services/config.service';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  constructor(private configService: ApiConfigService) {
    passport.use(
      new BasicStrategy(function (username, password, done) {
        if (
          configService.basicAuthConfig.username === username &&
          configService.basicAuthConfig.password === password
        ) {
          return done(null, true);
        }

        return done(new UnauthorizedException());
      })
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    const authenticate = () =>
      passport.authenticate('basic', { session: false })(req, res, next);

    return authenticate();
  }
}
