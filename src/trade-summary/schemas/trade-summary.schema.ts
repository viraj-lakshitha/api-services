import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'cse-trade-summary',
  timestamps: true,
})
export class TradeSummary {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  symbol: string;

  @Prop()
  quantity?: number | null;

  @Prop()
  percentageChange?: number | null;

  @Prop()
  change?: number | null;

  @Prop()
  price?: number | null;

  @Prop()
  previousClose?: number | null;

  @Prop()
  high?: number | null;

  @Prop()
  low?: number | null;

  @Prop()
  lastTradedTime?: number | null;

  @Prop()
  issueDate?: string | null;

  @Prop()
  turnover?: number | null;

  @Prop()
  sharevolume?: number | null;

  @Prop()
  tradevolume?: number | null;

  @Prop()
  marketCap?: number | null;

  @Prop()
  marketCapPercentage?: number | null;

  @Prop()
  open?: number | null;

  @Prop()
  closingPrice?: number | null;

  @Prop()
  crossingVolume?: number | null;

  @Prop()
  crossingTradeVol?: number | null;

  @Prop()
  status?: number | null;
}

export type TradeSummaryDocument = HydratedDocument<TradeSummary>;

export const TradeSummarySchema = SchemaFactory.createForClass(TradeSummary);
