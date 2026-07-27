import { Service } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

export abstract class Cache {
  abstract get(req: HttpRequest<unknown>): HttpResponse<unknown> | null;
  abstract put(req: HttpRequest<unknown>, response: HttpResponse<unknown>): void;
  abstract clear(): void;
}

export interface CacheEntry {
  url: string;
  response: HttpResponse<unknown>;
  entryTime: number;
}

const MAX_CACHE_AGE = 30000;

@Service()
export class HttpCacheService implements Cache {
  private cacheMap = new Map<string, CacheEntry>();

  get(req: HttpRequest<unknown>): HttpResponse<unknown> | null {
    const entry = this.cacheMap.get(req.urlWithParams);
    if (!entry) {
      return null;
    }
    const isExpired = Date.now() - entry.entryTime > MAX_CACHE_AGE;
    return isExpired ? null : entry.response;
  }

  put(req: HttpRequest<unknown>, res: HttpResponse<unknown>): void {
    const entry: CacheEntry = {
      url: req.urlWithParams,
      response: res,
      entryTime: Date.now(),
    };
    this.cacheMap.set(req.urlWithParams, entry);
    this.deleteExpiredCache();
  }

  clear(): void {
    this.cacheMap = new Map();
  }

  private deleteExpiredCache() {
    this.cacheMap.forEach((entry) => {
      if (Date.now() - entry.entryTime > MAX_CACHE_AGE) {
        this.cacheMap.delete(entry.url);
      }
    });
  }
}
