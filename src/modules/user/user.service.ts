import * as bcryptjs from 'bcryptjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';
import { AuthService } from '@auth/auth.service';
import { WrongPasswordException } from '@user/exceptions/wrong-password.exception';
import { RegisterDto } from '@user/dto/register.dto';
import { UserAlreadyExistsException } from '@user/exceptions/user-already-exists.exception';
import { TacNotAcceptedException } from '@user/exceptions/tac-not-accepted.exception';
import { EmailService } from '@shared/email.service';
import { EmailAlreadyConfirmedException } from '@user/exceptions/email-already-confirmed.exception';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService
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

    const createdUser = await this.prisma.user.create({
      data: {
        ...registrationDto,
        password: hashedPassword
      }
    });

    const confirmHash = await bcryptjs.hash('', 10);
    await this.prisma.confirmationHashes.create({
      data: { userId: createdUser.id, confirmHash }
    });
    await this.emailService.sendConfirmationEmail({
      target: registrationDto.email,
      confirmHash
    });

    return { message: 'success' };
  }

  async accountConfirmation({ confirmHash }: { confirmHash: string }) {
    const confirmationHash = await this.prisma.confirmationHashes.findFirst({
      where: { confirmHash },
      include: { user: true }
    });

    if (!confirmationHash) throw new BadRequestException();
    if (confirmationHash.confirmed) throw new EmailAlreadyConfirmedException();

    await this.prisma.confirmationHashes.update({
      where: { id: confirmationHash.id },
      data: {
        confirmed: true,
        user: {
          update: {
            accountConfirm: true
          }
        }
      }
    });

    return { message: 'success' };
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

  async phoneConfirmation({ code }: { code: string }) {
    // const confirmationPhone = await
  }
}
