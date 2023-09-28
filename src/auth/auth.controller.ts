import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AllowUnauthorizedRequest } from './auth.guard';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { LoginUserDto } from '@/users/dto/login-user.dto';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('/sign-up')
  @AllowUnauthorizedRequest()
  @UsePipes(ValidationPipe)
  signUp(@Body() signUpUserDto: CreateUserDto) {
    return this.authService.signUp(signUpUserDto);
  }

  @Post('/login')
  @AllowUnauthorizedRequest()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('/preview-code-verification')
  previewEmailWithCodeVerification() {
    return this.authService.previewCodeVerificationEmail();
  }
}
