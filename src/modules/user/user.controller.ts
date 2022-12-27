import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
import { PhoneConfirmationDto } from '@user/dto/phoneConfirmation.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-in')
  login(@Body() payload: LoginDto) {
    return this.userService.login(payload);
  }

  @Post('sign-up')
  register(@Body() payload: RegisterDto) {
    return this.userService.register(payload);
  }

  @Post('logout')
  logout() {
    return this.userService.logout();
  }

  @Get('account-confirmation/:confirmHash')
  accountConfirmation(@Param('confirmHash') confirmHash: string) {
    return this.userService.accountConfirmation({ confirmHash });
  }

  @Post('phone-confirmation')
  phoneConfirmation(@Body() { code }: PhoneConfirmationDto) {
    return this.userService.phoneConfirmation({ code });
  }
}
