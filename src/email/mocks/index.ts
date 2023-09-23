import { EmailModule } from '../email.module';
import { EmailService } from '../email.service';
import { EmailVerificationPayload } from '../email.service.types';
import { EmailServiceTemplate } from '../templates';

export class EmailServiceMock implements EmailServiceTemplate {
  sendCodeToUserEmail({}: EmailVerificationPayload): void {}
}

export const EmailProviderMock = {
  provide: EmailService,
  useClass: EmailServiceMock,
};

export const EmailModuleMock = {
  module: EmailModule,
  providers: [EmailProviderMock],
};
