import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';
import { AuthService } from '@auth/auth.service';
import { EmailService } from '@shared/email.service';
import { LoggerService } from '@shared/logger.service';
import { ValidatorService } from '@shared/validator.service';
import {
  SignInRequest,
  SignUpRequest,
  GetSettingsRequest
} from './dto/user-dtos.export';
import {
  WrongCredentialsException,
  AccountNotConfirmedException,
  UserAlreadyExistsException,
  TacNotAcceptedException,
  ValidationErrorException,
  EmailAlreadyConfirmedException
} from './exceptions/user-exceptions.export';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly validatorService: ValidatorService,
    private readonly loggerService: LoggerService
  ) {}

  async singIn(SignInRequest: SignInRequest) {
    const user = await this.prisma.users.findFirst({
      where: { email: SignInRequest.email }
    });
    if (!user) throw new WrongCredentialsException();
    if (!user.accountConfirm) throw new AccountNotConfirmedException();

    const passwordEquality = await bcryptjs.compare(
      SignInRequest.password,
      user.password
    );
    if (!passwordEquality) throw new WrongCredentialsException();

    return await this.authService.updateTokens({
      userId: user.id,
      email: user.email
    });
  }

  async signUp(SignUpRequest: SignUpRequest) {
    const alreadyExistingUser = await this.prisma.users.findFirst({
      where: { email: SignUpRequest.email }
    });
    if (alreadyExistingUser) throw new UserAlreadyExistsException();

    if (!SignUpRequest.tac) throw new TacNotAcceptedException();

    if (
      !this.validatorService.validateEmail(SignUpRequest.email) ||
      !this.validatorService.validatePassword(SignUpRequest.password)
    )
      throw new ValidationErrorException();

    const hashedPassword = await bcryptjs.hash(SignUpRequest.password, 10);

    const createdUser = await this.prisma.users.create({
      data: {
        ...SignUpRequest,
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
      target: SignUpRequest.email,
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

  async getSettings(payload: GetSettingsRequest) {
    return {
      firstName: '',
      lastName: '',
      bio: ''
    };
  }
}
