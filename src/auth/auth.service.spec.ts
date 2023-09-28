import { USER_TEST, USER_TEST_PASSWORD } from '@/users/mocks/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { isJWT } from 'class-validator';
import { AppJwtModule } from './auth.module';
import { AuthService } from './auth.service';
import { UsersModuleMock } from './mocks';
import { CodeModuleMock } from '@/code/mocks';
import { LoginUserDto } from '@/users/dto/login-user.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { EmailModuleMock } from '@/email/mocks';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EmailModuleMock, CodeModuleMock, UsersModuleMock, AppJwtModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to sign up a user', async () => {
    const spy = jest.spyOn(service, 'signUp');
    const entries: CreateUserDto = {
      email: USER_TEST.email,
      password: USER_TEST_PASSWORD,
      name: USER_TEST.name,
      description: USER_TEST.description,
    };
    const result = await service.signUp(entries);
    expect(spy).toHaveBeenCalled();
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('hashedPassword');
  });

  it('should be able to login a user', async () => {
    const spy = jest.spyOn(service, 'login');
    const entries: LoginUserDto = {
      email: USER_TEST.email,
      password: USER_TEST_PASSWORD,
    };
    const result = await service.login(entries);
    const { token, refreshToken } = result;
    expect(spy).toHaveBeenCalled();
    expect(result).not.toBeNull();
    expect(isJWT(token)).toBe(true);
    expect(isJWT(refreshToken)).toBe(true);
  });
});
