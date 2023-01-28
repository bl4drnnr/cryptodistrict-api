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
import { AccountNotConfirmedException } from "@user/exceptions/account-not-confirmed.exception";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly validatorService: ValidatorService,
    private readonly loggerService: LoggerService
  ) {}

  async singIn(signInDto: SignInDto) {
    const user = await this.prisma.users.findFirst({
      where: { email: signInDto.email }
    });
    if (!user) throw new WrongCredentialsException();
    if (!user.accountConfirm) throw new AccountNotConfirmedException();

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
    const alreadyExistingUser = await this.prisma.users.findFirst({
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

    const createdUser = await this.prisma.users.create({
      data: {
        ...signUpDto,
        password: hashedPassword
      }
    });

    this.loggerService
      .loggerInstance()
      .log('info', `User ${createdUser.email} has been successfully created`);

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

    if (!confirmationHash) {
      this.loggerService
        .loggerInstance()
        .log('error', `Wrong hash: ${confirmHash}`);
      throw new BadRequestException();
    }
    if (confirmationHash.confirmed) {
      this.loggerService
        .loggerInstance()
        .log('error', `Try to reconfirm hash ${confirmHash}`);
      throw new EmailAlreadyConfirmedException();
    }

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

    this.loggerService
      .loggerInstance()
      .log('info', `User account with hash ${confirmHash} has been confirmed.`);

    return { message: 'success' };
  }

  async logout(userId: string) {
    return await this.authService.deleteRefreshToken(userId);
  }
}
