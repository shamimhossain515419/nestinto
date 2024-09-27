import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Initialize transporter using environment variables
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('MAIL_SERVICE'),
      secure: this.configService.get<boolean>('MAIL_SECURE'),
      port: this.configService.get<number>('MAIL_PORT'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_USER'),
        to,
        subject,
        text,
        html,
      });

      console.log('Message sent: %s', info.messageId);
      return !!info.messageId;
    } catch (error) {
      console.error('Error sending email: ', error);
      return false;
    }
  }
}
