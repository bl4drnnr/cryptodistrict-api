import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async generateTokens({ userId }: { userId: string }) {
    //
  }
}
