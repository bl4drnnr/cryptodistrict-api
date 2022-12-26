import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('local'))
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

  @Get('account-confirm/:confirmHash')
  accountConfirm(@Param('confirmHash') confirmHash: string) {
    return this.userService.accountConfirm({ confirmHash });
  }
}
