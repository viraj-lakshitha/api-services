import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class DnsLookupDto {
  @IsString()
  @IsNotEmpty()
  domain: string;
}

export class DnsLookupWithFamilyDto {
  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsOptional()
  @IsIn([4, 6])
  family?: 4 | 6;
}

export class DnsReverseLookupDto {
  @IsString()
  @IsNotEmpty()
  ipAddress: string;
}

export class DnsRecordTypeDto {
  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['A', 'AAAA', 'MX', 'TXT', 'NS', 'SOA', 'CNAME'])
  recordType: string;
}
