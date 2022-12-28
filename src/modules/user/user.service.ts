import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';
import { AuthService } from '@auth/auth.service';
import { WrongCredentialsException } from '@user/exceptions/wrong-credentials.exception';
import { SignUpDto } from '@user/dto/sign-up/request.dto';
import { UserAlreadyExistsException } from '@user/exceptions/user-already-exists.exception';
import { TacNotAcceptedException } from '@user/exceptions/tac-not-accepted.exception';
import { EmailService } from '@shared/email.service';
import { EmailAlreadyConfirmedException } from '@user/exceptions/email-already-confirmed.exception';
import { SignInDto } from '@user/dto/sign-in/request.dto';
import { LoggerService } from '@shared/logger.service';
import { ValidatorService } from '@shared/validator.service';
import { ValidationErrorException } from '@user/exceptions/validation-error.exception';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly validatorService: ValidatorService,
    private readonly loggerInstance: LoggerService
  ) {}

  async singIn(signInDto: SignInDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: signInDto.email }
    });
    if (!user) throw new WrongCredentialsException();

    const passwordEquality = await bcryptjs.compare(
      signInDto.password,
      user.password
    );
    if (!passwordEquality) throw new WrongCredentialsException();

    return await this.authService.updateTokens({
      userId: user.id,
      email: user.email
    });
  }

  async signUp(signUpDto: SignUpDto) {
    const alreadyExistingUser = await this.prisma.user.findFirst({
      where: { email: signUpDto.email }
    });
    if (alreadyExistingUser) throw new UserAlreadyExistsException();

    if (!signUpDto.tac) throw new TacNotAcceptedException();

    if (
      !this.validatorService.validateEmail(signUpDto.email) ||
      !this.validatorService.validatePassword(signUpDto.password)
    )
      throw new ValidationErrorException();

    const hashedPassword = await bcryptjs.hash(signUpDto.password, 10);

    const createdUser = await this.prisma.user.create({
      data: {
        ...signUpDto,
        password: hashedPassword
      }
    });

    // const confirmHash = await bcryptjs.hash('', 10);
    const confirmHash = crypto.randomBytes(20).toString('hex');
    await this.prisma.confirmationHashes.create({
      data: { userId: createdUser.id, confirmHash }
    });
    await this.emailService.sendConfirmationEmail({
      target: signUpDto.email,
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

  async logout(userId: string) {
    return await this.authService.deleteRefreshToken(userId);
  }
}
