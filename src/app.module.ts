import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DnsModule } from './dns/dns.module';
import { EmailModule } from './email/email.module';
import { TradeSummaryModule } from './trade-summary/trade-summary.module';
import configuration from './config/configuration';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongodbUri'),
        autoCreate: true,
      }),
    }),
    DnsModule,
    EmailModule,
    TradeSummaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
