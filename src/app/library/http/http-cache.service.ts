import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

export abstract class Cache {
  abstract get(req: HttpRequest<any>): HttpResponse<any> | null;
  abstract put(req: HttpRequest<any>, response: HttpResponse<any>): void;
  abstract clear(): void;
}

export interface CacheEntry {
  url: string;
  response: HttpResponse<any>;
  entryTime: number;
}

const MAX_CACHE_AGE = 30000;

@Injectable({
  providedIn: 'root',
})
export class HttpCacheService implements Cache {
  private cacheMap: Map<string, CacheEntry> = new Map();

  get(req: HttpRequest<any>): HttpResponse<any> | null {
    const entry = this.cacheMap.get(req.urlWithParams);
    if (!entry) {
      return null;
    }
    const isExpired = Date.now() - entry.entryTime > MAX_CACHE_AGE;
    return isExpired ? null : entry.response;
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>): void {
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
