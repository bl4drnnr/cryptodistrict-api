import * as bcryptjs from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';
import { AuthService } from '@auth/auth.service';
import { WrongPasswordException } from '@user/exceptions/wrong-password.exception';
import { RegisterDto } from '@user/dto/register.dto';
import { UserAlreadyExistsException } from '@user/exceptions/user-already-exists.exception';
import { TacNotAcceptedException } from '@user/exceptions/tac-not-accepted.exception';
import { EmailService } from '@shared/email.service';
import { PhoneService } from '@shared/phone.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly phoneService: PhoneService
  ) {}

  async login({ email, password }: { email: string; password: string }) {
    // return this.authService.generateTokens({ userId: user.id });
  }

  async register(registrationDto: RegisterDto) {
    const alreadyExistingUser = await this.prisma.user.findFirst({
      where: { email: registrationDto.email }
    });
    if (alreadyExistingUser) throw new UserAlreadyExistsException();

    if (!registrationDto.tac) throw new TacNotAcceptedException();

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
