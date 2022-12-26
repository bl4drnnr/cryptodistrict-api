import * as bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AuthService } from '@auth/auth.service';
import { WrongPasswordException } from '@user/exceptions/wrong-password.exception';
import { RegisterDto } from '@user/dto/register.dto';
import { UserAlreadyExistsException } from '@user/exceptions/user-already-exists.exception';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {}

  async login({ email, password }: { email: string; password: string }) {
    // return this.authService.generateTokens({ userId: user.id });
  }

  async register(registrationDto: RegisterDto) {
    const alreadyExistingUser = await this.prisma.user.findFirst({
      where: { email: registrationDto.email }
    });
    if (alreadyExistingUser) throw new UserAlreadyExistsException();

    const hashedPassword = await bcryptjs.hash(registrationDto.password, 10);

    return await this.prisma.user.create({
      data: {
        ...registrationDto,
        password: hashedPassword
      }
    });
  }

  async logout() {
    //
  }

  async validateUser({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.user.findFirstOrThrow({ where: { email } });
    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) throw new WrongPasswordException();

    return user;
  }
}