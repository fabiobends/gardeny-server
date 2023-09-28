import { EmailModule } from '@/email/email.module';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AppJwtModule } from './auth.module';
import { AuthService } from './auth.service';
import { UsersModuleMock } from './mocks';
import { CodeModuleMock } from '@/code/mocks';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EmailModule, CodeModuleMock, UsersModuleMock, AppJwtModule],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
