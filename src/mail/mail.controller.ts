import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @Auth(AuthType.None)
  async sendEmail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
    @Body('html') html?: string,
  ) {
    const result = await this.mailService.sendEmail(to, subject, text, html);
    return { success: result };
  }
}
