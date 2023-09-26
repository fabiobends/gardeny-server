import { CODE_TEST, CodeProviderMock } from './mocks/index';
import { Test, TestingModule } from '@nestjs/testing';
import { CodeService } from './code.service';
import { USER_TEST } from '@/users/mocks/constants';

describe('CodeService', () => {
  let service: CodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeProviderMock],
    }).compile();

    service = module.get<CodeService>(CodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate code for tester email', async () => {
    const code = await service.generateCodeForEmail(USER_TEST.email);
    expect(code).toHaveProperty('userId', USER_TEST.id);
  });

  it('should verify code by tester email', async () => {
    const isValid = await service.checkIfCodeIsValidForEmail(
      CODE_TEST.value,
      USER_TEST.email,
    );
    expect(isValid).toBe(true);
  });
});
