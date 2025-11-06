import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  private resend: Resend;
  private senderEmail: string;
  private senderName: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('email.resendApiKey');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not defined');
    }
    this.resend = new Resend(apiKey);
    this.senderEmail =
      this.configService.get<string>('email.senderEmail') ?? '';
    this.senderName = this.configService.get<string>('email.senderName') ?? '';
  }

  async sendEmail(sendEmailDto: SendEmailDto) {
    try {
      if (!this.senderEmail) {
        throw new BadRequestException(
          'SENDER_EMAIL environment variable is not defined',
        );
      }

      const fromAddress = this.senderName
        ? `${this.senderName} <${this.senderEmail}>`
        : this.senderEmail;

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

      if (
        response.error &&
        response.error instanceof Object &&
        'message' in response.error
      ) {
        const errorMessage = (response.error as Record<string, unknown>)
          .message as string;
        throw new InternalServerErrorException(
          `Failed to send email: ${errorMessage}`,
        );
      }

      return {
        success: true,
        messageId: response?.data?.id,
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
