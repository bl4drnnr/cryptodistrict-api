import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  Patch,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDecorator } from '@decorators/user.decorator';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ConfirmHashDto } from '@dto/confirm-hash.dto';
import { UserDto } from '@dto/user.dto';
import {
  LogoutResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  GetSettingsResponse,
  CloseAccountResponse,
  FreezeAccountResponse,
  ChangePasswordResponse,
  ChangeEmailResponse,
  ChangePasswordRequest,
  ChangeEmailRequest,
  SetPersonalSettingsRequest,
  SetPersonalSettingsResponse,
  SetNotificationSettingsRequest,
  SetNotificationSettingsResponse,
  AccountConfirmationResponse,
  GetUserResponse
} from './dto/user-dtos.export';
import { JwtGuard } from '@guards/jwt.guard';
import { FastifyReply } from 'fastify';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() payload: SignInRequest
  ) {
    const { _at, _rt } = await this.userService.singIn(payload);

    res.cookie('_rt', _rt);

    return new SignInResponse(_at);
  }

  @ApiExtraModels(UserDto)
  @Post('sign-up')
  async signUp(@Body() payload: SignUpRequest) {
    await this.userService.signUp(payload);

    return new SignUpResponse();
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(
    @UserDecorator() userId: string,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    res.clearCookie('_rt');
    await this.userService.logout(userId);

    return new LogoutResponse();
  }

  @ApiExtraModels(ConfirmHashDto)
  @Get('account-confirmation/:confirmHash')
  async accountConfirmation(@Param('confirmHash') confirmHash: string) {
    await this.userService.accountConfirmation({ confirmHash });

    return new AccountConfirmationResponse();
  }

  @Get('get-settings')
  @UseGuards(JwtGuard)
  async getSettings(@UserDecorator() userId: string) {
    const userSettings = await this.userService.getSettings(userId);

    return new GetSettingsResponse(userSettings);
  }

  @Get('get-user/:userNumber')
  async getUserByNumber(@Param('userNumber') userNumber: string) {
    const user = await this.userService.getUserByUserNumber(userNumber);

    return new GetUserResponse();
  }

  @Patch('set-personal-settings')
  @UseGuards(JwtGuard)
  async setPersonalSettings(
    @UserDecorator() userId: string,
    @Body() payload: SetPersonalSettingsRequest
  ) {
    await this.userService.updateUserPersonalSettings(userId, payload);

    return new SetPersonalSettingsResponse();
  }

  @Patch('set-notification-settings')
  @UseGuards(JwtGuard)
  async setNotificationSettings(
    @UserDecorator() userId: string,
    @Body() payload: SetNotificationSettingsRequest
  ) {
    await this.userService.updateUserNotificationSettings(userId, payload);

    return new SetNotificationSettingsResponse();
  }

  @Patch('freeze-account')
  @UseGuards(JwtGuard)
  async freezeAccount(@UserDecorator() userId: string) {
    await this.userService.freezeAccount(userId);

    return new FreezeAccountResponse();
  }

  @Patch('close-account')
  @UseGuards(JwtGuard)
  async closeAccount(@UserDecorator() userId: string) {
    await this.userService.closeAccount(userId);

    return new CloseAccountResponse();
  }

  @Patch('change-password')
  @UseGuards(JwtGuard)
  async changePassword(
    @UserDecorator() userId: string,
    @Body() payload: ChangePasswordRequest
  ) {
    await this.userService.changePassword(userId, payload);

    return new ChangePasswordResponse();
  }

  @Patch('change-email')
  @UseGuards(JwtGuard)
  async changeEmail(
    @UserDecorator() userId: string,
    @Body() payload: ChangeEmailRequest
  ) {
    await this.userService.changeEmail(userId, payload);

    return new ChangeEmailResponse();
  }
}
