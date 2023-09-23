import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailVerificationPayload } from './email.service.types';
import { EmailServiceTemplate } from './templates';

@Injectable()
export class EmailService implements EmailServiceTemplate {
  constructor(private readonly mailerService: MailerService) {}

  sendCodeToUserEmail({ email, name, code }: EmailVerificationPayload): void {
    this.mailerService.sendMail({
      to: email,
      subject: 'Code Verification - Gardeny',
      template: 'code-verification',
      context: {
        name,
        code,
      },
    });
  }
}
