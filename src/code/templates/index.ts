import { Code } from '../entities/code.entity';

export abstract class CodeServiceTemplate {
  abstract generateCodeForEmail(email: string): Promise<Code>;

  abstract checkIfCodeIsValidForEmail(
    code: number,
    email: string,
  ): Promise<boolean>;
}
