import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Resend } from 'resend';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not defined');
    }
    this.resend = new Resend(apiKey);
  }

  async sendEmail(sendEmailDto: SendEmailDto) {
    try {
      const senderEmail = process.env.SENDER_EMAIL;
      const senderName = process.env.SENDER_NAME;

      if (!senderEmail) {
        throw new BadRequestException(
          'SENDER_EMAIL environment variable is not defined',
        );
      }

      const fromAddress = senderName
        ? `${senderName} <${senderEmail}>`
        : senderEmail;

      const response = await this.resend.emails.send({
        from: fromAddress,
        to: sendEmailDto.to,
        subject: sendEmailDto.subject,
        html: sendEmailDto.html,
        text: sendEmailDto.text,
        ...(sendEmailDto.cc && { cc: sendEmailDto.cc }),
        ...(sendEmailDto.bcc && { bcc: sendEmailDto.bcc }),
        ...(sendEmailDto.replyTo && { replyTo: sendEmailDto.replyTo }),
      });

      if (response.error) {
        throw new InternalServerErrorException(
          `Failed to send email: ${response.error.message}`,
        );
      }

      return {
        success: true,
        messageId: response.data.id,
        to: sendEmailDto.to,
        subject: sendEmailDto.subject,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to send email',
      );
    }
  }
}
