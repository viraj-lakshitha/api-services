import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DnsModule } from './dns/dns.module';
import { EmailModule } from './email/email.module';
import { TradeSummaryModule } from './trade-summary/trade-summary.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017/api-services',
    ),
    DnsModule,
    EmailModule,
    TradeSummaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
