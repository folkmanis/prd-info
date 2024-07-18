import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClassTransformer } from 'class-transformer';
import { Observable, firstValueFrom, map } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { HttpOptions } from 'src/app/library/http/http-options';
import { ArchiveFacet, ArchiveRecord, SearchQuery } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class XmfArchiveApiService {
  private readonly path = getAppParams('apiPath') + 'xmf-search/';

  private queryStr = (query: SearchQuery, start?: number, limit?: number) => ({
    query: query.searialize(),
    start,
    limit,
  });

  constructor(
    private http: HttpClient,
    private transformer: ClassTransformer,
  ) {}

  async getXmfCustomer(): Promise<string[]> {
    return firstValueFrom(this.http.get<string[]>(this.path + 'customers'));
  }

  getArchive(query: SearchQuery, start?: number, limit?: number): Observable<ArchiveRecord[]> {
    return this.http
      .get<Record<string, any>[]>(this.path, new HttpOptions(this.queryStr(query, start, limit)))
      .pipe(map((data) => this.transformer.plainToInstance(ArchiveRecord, data)));
  }

  getCount(query: SearchQuery): Observable<number> {
    return this.http.get<{ count: number }>(this.path + 'count', new HttpOptions(this.queryStr(query))).pipe(map((data) => data['count']));
  }

  getFacet(query: SearchQuery): Observable<ArchiveFacet> {
    return this.http.get<ArchiveFacet>(this.path + 'facet', new HttpOptions(this.queryStr(query)));
  }
}
