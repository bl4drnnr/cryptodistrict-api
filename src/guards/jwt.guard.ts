import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '@auth/auth.service';

interface ITokenPayload {
  id: string;
  type: string;
  userId: string;
}

interface ITokenError {
  message: string;
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['application-authorization'];
    if (!authHeader)
      throw new UnauthorizedException({ message: 'unauthorized' });

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !token)
      throw new UnauthorizedException({ message: 'unauthorized' });

    const payload: ITokenPayload | ITokenError =
      this.authService.verifyToken(token);

    if (!('type' in payload))
      throw new UnauthorizedException({ message: 'unauthorized' });

    req.user = payload.userId;
    return true;
  }
}
