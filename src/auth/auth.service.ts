import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './entities/user-token.entity';
import { EmailService } from '@/email/email.service';
import { CodeService } from '@/code/code.service';
import { USER_TEST } from '@/users/mocks/constants';
import { CODE_TEST } from '@/code/mocks';
import { LoginUserDto } from '@/users/dto/login-user.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private emailService: EmailService,
    private codeService: CodeService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(data: CreateUserDto): Promise<User> {
    const existentUser = await this.usersService.findOneByEmail(data.email);
    if (existentUser) {
      throw new ConflictException('A user with email already exists.');
    }
    const user = await this.usersService.create(data);
    return this.checkIfUserIsValidThenSendCode(user);
  }

  private checkIfUserIsValidThenSendCode(user: User | null) {
    if (!user) {
      throw new BadRequestException(
        "Couldn't create account, invalid user data",
      );
    }
    return this.sendCodeVerificationAndReturnUser(user);
  }

  private async sendCodeVerificationAndReturnUser(user: User) {
    const code = await this.codeService.generateCodeForEmail(user.email);
    this.emailService.sendCodeToUserEmail({
      email: user.email,
      name: user.name,
      code: code.value,
    });
    return user;
  }

  async login(data: LoginUserDto): Promise<UserToken> {
    const user = await this.usersService.findOneByEmail(data.email);
    if (!user)
      throw new UnauthorizedException('Either password or email is invalid');
    return this.tryGetUserToken(user, data);
  }

  private async tryGetUserToken(
    user: User,
    data: LoginUserDto,
  ): Promise<UserToken> {
    try {
      const isValid = await this.usersService.verifyUserByPassword(
        user,
        data.password,
      );

      if (!isValid)
        throw new UnauthorizedException('Either password or email is invalid');

      const payload = { userId: user.id };
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '5m',
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });
      return {
        token,
        refreshToken,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new InternalServerErrorException("Couldn't login the user");
    }
  }

  previewCodeVerificationEmail() {
    this.emailService.sendCodeToUserEmail({
      email: USER_TEST.email,
      code: CODE_TEST.value,
      name: USER_TEST.name,
    });
  }
}
