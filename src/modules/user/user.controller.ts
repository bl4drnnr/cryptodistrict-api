import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() payload: LoginDto) {
    return this.userService.login(payload);
  }

  @Post('register')
  register(@Body() payload: RegisterDto) {
    return this.userService.register(payload);
  }

  @Post('logout')
  logout() {
    return this.userService.logout();
  }
}
