import { randomUUID } from 'node:crypto';
import { Code } from '../entities/code.entity';
import { CodeServiceTemplate } from '../templates';
import { USER_TEST } from '@/users/mocks/constants';
import { CodeService } from '../code.service';
import { CodeModule } from '../code.module';

export const CODE_TEST: Code = {
  value: 999999,
  id: randomUUID().toString(),
  createdAt: new Date(),
  userId: USER_TEST.id,
};

export class CodeServiceMock implements CodeServiceTemplate {
  async generateCodeForEmail(email: string): Promise<Code> {
    if (email === USER_TEST.email) return CODE_TEST;
    return {} as Code;
  }

  async checkIfCodeIsValidForEmail(
    code: number,
    email: string,
  ): Promise<boolean> {
    if (code === CODE_TEST.value && email === USER_TEST.email) return true;
    return false;
  }
}

export const CodeProviderMock = {
  provide: CodeService,
  useClass: CodeServiceMock,
};

export const CodeModuleMock = {
  module: CodeModule,
  providers: [CodeProviderMock],
};
