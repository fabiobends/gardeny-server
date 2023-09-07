import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { SignUpUserDto } from '../users/dto/sign-up-user.dto';
import { UserToken } from './entities/user-token.entity';

@Injectable()
export class AuthService {
  @Inject(UsersService)
  private readonly usersService: UsersService;

  async signUp(data: SignUpUserDto): Promise<UserToken> {
    const user = await this.usersService.signUp(data);
    return this.checkIfUserExistsThenReturnUserToken(user);
  }

  private checkIfUserExistsThenReturnUserToken(user: User | null): UserToken {
    if (!user) {
      throw new HttpException(
        "Couldn't create account, invalid user data",
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.tryGetUserToken(user);
  }

  private tryGetUserToken(user: User): UserToken {
    try {
      const token = this.getTokenForUser(
        user,
        process.env.JWT_SECRET_TOKEN as string,
        '30m',
      );
      return {
        token,
        refreshToken: null,
      };
    } catch (err) {
      throw new HttpException(
        "Couldn't sign up the user",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getTokenForUser(
    user: User,
    secret: string,
    expiresIn: string | number,
  ): string | null {
    if (!secret) return null;
    return jwt.sign({ id: user.id }, secret, {
      expiresIn,
    });
  }
}
