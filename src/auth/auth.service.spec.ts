import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app/app.module';
import { SignUpUserDto } from '@/users/dto/sign-up-user.dto';
import { USER_TEST, USER_TEST_PASSWORD } from '@/users/mocks/constants';
import { AuthService } from './auth.service';
import { UsersModuleMock } from './mocks';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModuleMock, AppModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to sign up a user', async () => {
    const spy = jest.spyOn(service, 'signUp');
    const entries: SignUpUserDto = {
      email: USER_TEST.email,
      password: USER_TEST_PASSWORD,
    };
    const result = await service.signUp(entries);
    expect(spy).toHaveBeenCalled();
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('token');
  });
});
