import { EmailVerificationPayload } from '../email.service.types';

export abstract class EmailServiceTemplate {
  abstract sendCodeToUserEmail(data: EmailVerificationPayload): void;
}
