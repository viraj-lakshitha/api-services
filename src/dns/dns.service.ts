import { Injectable } from '@nestjs/common';
import { promises as dns } from 'dns';

@Injectable()
export class DnsService {
  async lookup(domain: string): Promise<{ address: string; family: number }[]> {
    const results = await dns.resolve4(domain);
    return results.map((address) => ({
      address,
      family: 4,
    }));
  }

  async lookupWithFamily(
    domain: string,
    family?: 4 | 6,
  ): Promise<{ address: string; family: number }[]> {
    if (family === 6) {
      const results = await dns.resolve6(domain);
      return results.map((address) => ({
        address,
        family: 6,
      }));
    }

    const results = await dns.resolve4(domain);
    return results.map((address) => ({
      address,
      family: 4,
    }));
  }

  async reverseLookup(ipAddress: string): Promise<string[]> {
    const hostnames = await dns.reverse(ipAddress);
    return hostnames;
  }

  async resolveMx(
    domain: string,
  ): Promise<{ priority: number; exchange: string }[]> {
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords;
  }

  async resolveTxt(domain: string): Promise<string[][]> {
    const txtRecords = await dns.resolveTxt(domain);
    return txtRecords;
  }

  async resolveNs(domain: string): Promise<string[]> {
    const nsRecords = await dns.resolveNs(domain);
    return nsRecords;
  }

  async resolveSoa(domain: string): Promise<object> {
    const soaRecord = await dns.resolveSoa(domain);
    return soaRecord;
  }

  async resolveCname(domain: string): Promise<string[]> {
    const cnameRecords = await dns.resolveCname(domain);
    return cnameRecords;
  }
}
