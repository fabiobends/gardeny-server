import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpUserDto } from '../users/dto/sign-up-user.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('/sign-up')
  @UsePipes(ValidationPipe)
  create(@Body() signUpUserDto: SignUpUserDto) {
    this.authService.signUp(signUpUserDto);
  }
}