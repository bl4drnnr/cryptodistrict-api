import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LoginDto } from './dto/login/request.dto';
import { RegisterDto } from './dto/register/request.dto';
import { UserService } from './user.service';

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
}
