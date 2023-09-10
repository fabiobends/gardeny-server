import { SignUpUserDto } from '@/users/dto/sign-up-user.dto';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './entities/user-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(data: SignUpUserDto): Promise<UserToken> {
    const existentUser = await this.usersService.findOneByEmail(data.email);
    if (existentUser) {
      return this.tryGetTemporaryUserToken(existentUser);
    }
    const user = await this.usersService.signUp(data);
    return this.checkIfUserIsValidThenReturnTemporaryUserToken(user);
  }

  private checkIfUserIsValidThenReturnTemporaryUserToken(
    user: User | null,
  ): Promise<UserToken> {
    if (!user) {
      throw new BadRequestException(
        "Couldn't create account, invalid user data",
      );
    }
    return this.tryGetTemporaryUserToken(user);
  }

  private async tryGetTemporaryUserToken(user: User): Promise<UserToken> {
    try {
      const payload = { userId: user.id };
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '30m',
      });
      return {
        token,
        refreshToken: null,
      };
    } catch (err) {
      throw new InternalServerErrorException("Couldn't sign up the user");
    }
  }

  async login(data: SignUpUserDto): Promise<UserToken> {
    const user = await this.usersService.findOneByEmail(data.email);
    if (!user)
      throw new UnauthorizedException('Either password or email is invalid');
    return this.tryGetUserToken(user, data);
  }

  private async tryGetUserToken(
    user: User,
    data: SignUpUserDto,
  ): Promise<UserToken> {
    try {
      const isValid = await this.usersService.verifyUserByPassword(
        user,
        data.password,
      );

      if (!isValid) throw new Error('Either password or email is invalid');

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
      throw new UnauthorizedException(err.message);
    }
  }
}
