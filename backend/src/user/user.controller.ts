import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() authUserDto: AuthUserDto) {
    return this.userService.register(authUserDto);
  }

  @Post('login')
  login(@Body() authUserDto: AuthUserDto) {
    return this.userService.login(authUserDto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req: { user: User }) {
    return {
      id: req.user.id,
      phone: req.user.phone,
    };
  }
}
