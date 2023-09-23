import { getEnvironment } from '@/config/environment';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';

getEnvironment();

export const MailerModule = NestMailerModule.forRoot({
  transport: {
    host: process.env.MAIL_TRANSPORT_HOST,
    ignoreTLS: !Boolean(process.env.NODE_ENV === 'production'),
    secure: Boolean(process.env.NODE_ENV === 'production'),
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_DEV_INCOMING_USER,
      pass: process.env.MAIL_DEV_INCOMING_PASS,
    },
  },
  defaults: {
    from: process.env.DEFAULT_EMAIL_SENDER,
  },
  preview: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
  template: {
    dir: join(__dirname, 'layouts'),
    adapter: new PugAdapter(),
    options: {
      strict: true,
    },
  },
});
