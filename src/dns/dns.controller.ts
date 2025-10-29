import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { DnsService } from './dns.service';
import { ApiKeyGuard } from '../auth/api-key.guard';
import {
  DnsLookupDto,
  DnsLookupWithFamilyDto,
  DnsReverseLookupDto,
  DnsRecordTypeDto,
} from './dto/dns-lookup.dto';

@Controller('dns')
@UseGuards(ApiKeyGuard)
export class DnsController {
  constructor(private readonly dnsService: DnsService) {}

  @Post('lookup')
  async lookup(@Body(ValidationPipe) dnsLookupDto: DnsLookupDto) {
    try {
      const results = await this.dnsService.lookup(dnsLookupDto.domain);
      return {
        success: true,
        domain: dnsLookupDto.domain,
        records: results,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      if (
        errorMessage.includes('ENOTFOUND') ||
        errorMessage.includes('ENODATA')
      ) {
        throw new BadRequestException(
          `Domain "${dnsLookupDto.domain}" not found`,
        );
      }
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Post('lookup-with-family')
  async lookupWithFamily(
    @Body(ValidationPipe) dnsLookupWithFamilyDto: DnsLookupWithFamilyDto,
  ) {
    try {
      const results = await this.dnsService.lookupWithFamily(
        dnsLookupWithFamilyDto.domain,
        dnsLookupWithFamilyDto.family,
      );
      return {
        success: true,
        domain: dnsLookupWithFamilyDto.domain,
        family: dnsLookupWithFamilyDto.family || 4,
        records: results,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      if (
        errorMessage.includes('ENOTFOUND') ||
        errorMessage.includes('ENODATA')
      ) {
        throw new BadRequestException(
          `Domain "${dnsLookupWithFamilyDto.domain}" not found`,
        );
      }
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Post('reverse-lookup')
  async reverseLookup(
    @Body(ValidationPipe) dnsReverseLookupDto: DnsReverseLookupDto,
  ) {
    try {
      const results = await this.dnsService.reverseLookup(
        dnsReverseLookupDto.ipAddress,
      );
      return {
        success: true,
        ipAddress: dnsReverseLookupDto.ipAddress,
        hostnames: results,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      if (errorMessage.includes('ENOTFOUND')) {
        throw new BadRequestException(
          `No hostname found for IP "${dnsReverseLookupDto.ipAddress}"`,
        );
      }
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Post('mx-records')
  async resolveMx(@Body(ValidationPipe) dnsRecordTypeDto: DnsRecordTypeDto) {
    try {
      const results = await this.dnsService.resolveMx(dnsRecordTypeDto.domain);
      return {
        success: true,
        domain: dnsRecordTypeDto.domain,
        recordType: 'MX',
        records: results,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Post('txt-records')
  async resolveTxt(@Body(ValidationPipe) dnsRecordTypeDto: DnsRecordTypeDto) {
    try {
      const results = await this.dnsService.resolveTxt(dnsRecordTypeDto.domain);
      return {
        success: true,
        domain: dnsRecordTypeDto.domain,
        recordType: 'TXT',
        records: results,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Post('ns-records')
  async resolveNs(@Body(ValidationPipe) dnsRecordTypeDto: DnsRecordTypeDto) {
    try {
      const results = await this.dnsService.resolveNs(dnsRecordTypeDto.domain);
      return {
        success: true,
        domain: dnsRecordTypeDto.domain,
        recordType: 'NS',
        records: results,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Post('soa-record')
  async resolveSoa(@Body(ValidationPipe) dnsRecordTypeDto: DnsRecordTypeDto) {
    try {
      const results = await this.dnsService.resolveSoa(dnsRecordTypeDto.domain);
      return {
        success: true,
        domain: dnsRecordTypeDto.domain,
        recordType: 'SOA',
        record: results,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Post('cname-records')
  async resolveCname(@Body(ValidationPipe) dnsRecordTypeDto: DnsRecordTypeDto) {
    try {
      const results = await this.dnsService.resolveCname(
        dnsRecordTypeDto.domain,
      );
      return {
        success: true,
        domain: dnsRecordTypeDto.domain,
        recordType: 'CNAME',
        records: results,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
