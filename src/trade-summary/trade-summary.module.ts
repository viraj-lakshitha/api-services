import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TradeSummaryService } from './trade-summary.service';
import {
  TradeSummary,
  TradeSummarySchema,
} from './schemas/trade-summary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TradeSummary.name, schema: TradeSummarySchema },
    ]),
  ],
  providers: [TradeSummaryService],
})
export class TradeSummaryModule {}
