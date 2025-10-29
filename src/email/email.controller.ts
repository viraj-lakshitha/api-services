import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('email')
@UseGuards(ApiKeyGuard)
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body(ValidationPipe) sendEmailDto: SendEmailDto) {
    return this.emailService.sendEmail(sendEmailDto);
  }
}
