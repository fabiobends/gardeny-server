import { DatabaseService } from '@/database/database.service';
import { getRandomInt } from '@/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CodeServiceTemplate } from './templates';

@Injectable()
export class CodeService implements CodeServiceTemplate {
  constructor(private readonly database: DatabaseService) {}
  private readonly MAX_NUMBER = 999999;

  generateCodeForEmail(email: string) {
    const value = this.getRandomSixDigitCode();
    return this.database.createCode({ user: { connect: { email } }, value });
  }

  private getRandomSixDigitCode() {
    return getRandomInt(this.MAX_NUMBER);
  }

  async checkIfCodeIsValidForEmail(code: number, email: string) {
    const codeInfo = await this.database.findCodeByValue(code);
    if (!codeInfo) {
      throw new NotFoundException('Verification code not found.');
    }
    return email === codeInfo.user.email;
  }
}
