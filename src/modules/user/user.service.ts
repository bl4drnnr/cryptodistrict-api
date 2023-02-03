import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';
import { AuthService } from '@auth/auth.service';
import { EmailService } from '@shared/email.service';
import { LoggerService } from '@shared/logger.service';
import { ValidatorService } from '@shared/validator.service';
import {
  ChangeEmailRequest,
  ChangePasswordRequest,
  SetNotificationSettingsRequest,
  SetPersonalSettingsRequest,
  SignInRequest,
  SignUpRequest
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

  async singIn(payload: SignInRequest) {
    const user = await this.prisma.users.findFirst({
      where: { email: payload.email }
    });
    if (!user) throw new WrongCredentialsException();
    if (!user.accountConfirm) throw new AccountNotConfirmedException();

    const passwordEquality = await bcryptjs.compare(
      payload.password,
      user.password
    );
    if (!passwordEquality) throw new WrongCredentialsException();

    return await this.authService.updateTokens({
      userId: user.id,
      email: user.email
    });
  }

  async signUp(payload: SignUpRequest) {
    const alreadyExistingUser = await this.prisma.users.findFirst({
      where: { email: payload.email }
    });
    if (alreadyExistingUser) throw new UserAlreadyExistsException();

    if (!payload.tac) throw new TacNotAcceptedException();

    if (
      !this.validatorService.validateEmail(payload.email) ||
      !this.validatorService.validatePassword(payload.password)
    )
      throw new ValidationErrorException();

    const hashedPassword = await bcryptjs.hash(payload.password, 10);
    const userNumber = Math.round(Math.random() * 1e10).toString();

    const createdUser = await this.prisma.users.create({
      data: {
        ...payload,
        userNumber,
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
      target: payload.email,
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

  async getSettings(userId: string) {
    const userSettings = await this.prisma.users.findFirst({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        twitter: true,
        linkedIn: true,
        personalWebsite: true,
        title: true,
        bio: true,
        emailChanged: true,
        lastPassChange: true,
        twoFaType: true,
        receiveNotifications: true,
        username: true,
        publicEmail: true
      }
    });

    return {
      personalInformation: {
        firstName: userSettings.firstName,
        lastName: userSettings.lastName,
        twitter: userSettings.title,
        linkedIn: userSettings.linkedIn,
        personalWebsite: userSettings.personalWebsite,
        title: userSettings.title,
        bio: userSettings.bio,
        username: userSettings.username,
        publicEmail: userSettings.publicEmail
      },
      notificationSettings: {
        receiveNotifications: userSettings.receiveNotifications
      },
      securitySettings: {
        emailChanged: userSettings.emailChanged,
        lastPassChange: userSettings.lastPassChange,
        twoFaType: userSettings.twoFaType,
        email: userSettings.email,
        phoneNumber: userSettings.phoneNumber
      }
    };
  }

  async freezeAccount(userId: string) {
    //
  }

  async closeAccount(userId: string) {
    //
  }

  async changePassword(userId: string, payload: ChangePasswordRequest) {
    //
  }

  async changeEmail(userId: string, payload: ChangeEmailRequest) {
    //
  }

  async updateUserPersonalSettings(
    userId: string,
    payload: SetPersonalSettingsRequest
  ) {
    return await this.prisma.users.update({
      where: { id: userId },
      data: { ...payload }
    });
  }

  async updateUserNotificationSettings(
    userId: string,
    payload: SetNotificationSettingsRequest
  ) {
    return await this.prisma.users.update({
      where: { id: userId },
      data: { ...payload }
    });
  }
}
