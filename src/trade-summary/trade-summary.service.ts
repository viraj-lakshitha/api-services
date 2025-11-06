import axios, { AxiosInstance } from 'axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TradeSummary,
  TradeSummaryDocument,
} from './schemas/trade-summary.schema';

interface TradeSummaryPayload {
  id: number;
  name: string;
  symbol: string;
  quantity?: number | null;
  percentageChange?: number | null;
  change?: number | null;
  price?: number | null;
  previousClose?: number | null;
  high?: number | null;
  low?: number | null;
  lastTradedTime?: number | null;
  issueDate?: string | null;
  turnover?: number | null;
  sharevolume?: number | null;
  tradevolume?: number | null;
  marketCap?: number | null;
  marketCapPercentage?: number | null;
  open?: number | null;
  closingPrice?: number | null;
  crossingVolume?: number | null;
  crossingTradeVol?: number | null;
  status?: number | null;
}

interface TradeSummaryResponse {
  reqTradeSummery?: TradeSummaryPayload[];
}

@Injectable()
export class TradeSummaryService implements OnModuleInit {
  private readonly logger = new Logger(TradeSummaryService.name);
  private readonly client: AxiosInstance = axios.create({
    baseURL: 'https://www.cse.lk/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
    maxRedirects: 0,
  });
  private readonly maxRetries = 3;
  private readonly baseBackoffMs = 1000;

  constructor(
    @InjectModel(TradeSummary.name)
    private readonly tradeSummaryModel: Model<TradeSummaryDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.syncTradeSummary();
  }

  @Cron('0 8 * * *', {
    timeZone: 'Asia/Colombo',
  })
  async handleDailySync(): Promise<void> {
    await this.syncTradeSummary();
  }

  private async syncTradeSummary(): Promise<void> {
    try {
      const payload = await this.fetchTradeSummary();

      if (!Array.isArray(payload) || payload.length === 0) {
        this.logger.warn('Trade summary payload empty or undefined.');
        return;
      }

      const operations = payload.map((entry) => ({
        updateOne: {
          filter: { id: entry.id },
          update: { $set: this.normalizeEntry(entry) },
          upsert: true,
        },
      }));

      const result = await this.tradeSummaryModel.bulkWrite(operations, {
        ordered: false,
      });
      const upsertedCount = result.upsertedCount ?? 0;
      const modifiedCount = result.modifiedCount ?? 0;
      const sampleSymbols =
        payload
          .slice(0, Math.min(payload.length, 5))
          .map((item) => item.symbol)
          .join(', ') || 'n/a';

      this.logger.log(
        `Trade summary sync complete: received ${payload.length}, inserted ${upsertedCount}, updated ${modifiedCount}. Sample symbols: ${sampleSymbols}`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to sync trade summary data: ${message}`, stack);
    }
  }

  private async fetchTradeSummary(): Promise<TradeSummaryPayload[]> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt += 1) {
      try {
        const { data } =
          await this.client.post<TradeSummaryResponse>('/tradeSummary');
        return Array.isArray(data?.reqTradeSummery) ? data.reqTradeSummery : [];
      } catch (error: unknown) {
        if (attempt >= this.maxRetries || !this.shouldRetry(error)) {
          throw error;
        }
        const delay = this.baseBackoffMs * 2 ** (attempt - 1);
        this.logger.warn(
          `Trade summary fetch attempt ${attempt} failed (${this.describeError(
            error,
          )}). Retrying in ${delay} ms.`,
        );
        await this.sleep(delay);
      }
    }

    return [];
  }

  private shouldRetry(error: unknown): boolean {
    if (!axios.isAxiosError(error)) {
      return true;
    }

    const status = error.response?.status;
    if (status === undefined) {
      return true; // network or timeout
    }

    if (status >= 500 || status === 429 || status === 408) {
      return true;
    }

    return false;
  }

  private describeError(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const statusText = error.response?.statusText;
      return status ? `${status} ${statusText ?? ''}`.trim() : error.message;
    }

    return error instanceof Error ? error.message : 'Unknown error';
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private normalizeEntry(entry: TradeSummaryPayload): TradeSummaryPayload {
    return {
      id: entry.id,
      name: entry.name,
      symbol: entry.symbol,
      quantity: entry.quantity ?? null,
      percentageChange: entry.percentageChange ?? null,
      change: entry.change ?? null,
      price: entry.price ?? null,
      previousClose: entry.previousClose ?? null,
      high: entry.high ?? null,
      low: entry.low ?? null,
      lastTradedTime: entry.lastTradedTime ?? null,
      issueDate: entry.issueDate ?? null,
      turnover: entry.turnover ?? null,
      sharevolume: entry.sharevolume ?? null,
      tradevolume: entry.tradevolume ?? null,
      marketCap: entry.marketCap ?? null,
      marketCapPercentage: entry.marketCapPercentage ?? null,
      open: entry.open ?? null,
      closingPrice: entry.closingPrice ?? null,
      crossingVolume: entry.crossingVolume ?? null,
      crossingTradeVol: entry.crossingTradeVol ?? null,
      status: entry.status ?? null,
    };
  }
}
