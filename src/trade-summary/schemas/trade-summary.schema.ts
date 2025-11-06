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

  @Prop({ type: Number })
  quantity?: number;

  @Prop({ type: Number })
  percentageChange?: number;

  @Prop({ type: Number })
  change?: number;

  @Prop({ type: Number })
  price?: number;

  @Prop({ type: Number })
  previousClose?: number;

  @Prop({ type: Number })
  high?: number;

  @Prop({ type: Number })
  low?: number;

  @Prop({ type: Number })
  lastTradedTime?: number;

  @Prop({ type: String })
  issueDate?: string;

  @Prop({ type: Number })
  turnover?: number;

  @Prop({ type: Number })
  sharevolume?: number;

  @Prop({ type: Number })
  tradevolume?: number;

  @Prop({ type: Number })
  marketCap?: number;

  @Prop({ type: Number })
  marketCapPercentage?: number;

  @Prop({ type: Number })
  open?: number;

  @Prop({ type: Number })
  closingPrice?: number;

  @Prop({ type: Number })
  crossingVolume?: number;

  @Prop({ type: Number })
  crossingTradeVol?: number;

  @Prop({ type: Number })
  status?: number;
}

export type TradeSummaryDocument = HydratedDocument<TradeSummary>;

export const TradeSummarySchema = SchemaFactory.createForClass(TradeSummary);
