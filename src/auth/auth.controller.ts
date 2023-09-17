import { SignUpUserDto } from '@/users/dto/sign-up-user.dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AllowUnauthorizedRequest } from './auth.guard';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('/sign-up')
  @AllowUnauthorizedRequest()
  @UsePipes(ValidationPipe)
  signUp(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.signUp(signUpUserDto);
  }

  @Post('/login')
  @AllowUnauthorizedRequest()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  login(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.login(signUpUserDto);
  }
}
