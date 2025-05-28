import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { renameKeys, ValidatorService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http/http-options';
import { ArchiveFacet, ArchiveRecord, archiveRecordKeysMap, SearchQuery } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class XmfArchiveApiService {
  #path = getAppParams('apiPath') + 'xmf-search/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  #queryStr = (query: SearchQuery, start?: number, limit?: number) => ({
    query: query.searialize(),
    start,
    limit,
  });

  async getXmfCustomers(): Promise<string[]> {
    const data$ = this.#http.get<string[]>(this.#path + 'customers', new HttpOptions());
    return this.#validator.validateStringArrayAsync(data$);
  }

  async getArchive(query: SearchQuery, start?: number, limit?: number): Promise<ArchiveRecord[]> {
    const data = await firstValueFrom(this.#http.get<Record<string, any>[]>(this.#path, new HttpOptions(this.#queryStr(query, start, limit))));
    return this.#validator.validateArray(
      ArchiveRecord,
      data.map((record) => renameKeys(archiveRecordKeysMap, record)),
    );
  }

  getCount(query: SearchQuery): Observable<number> {
    return this.#http.get<{ count: number }>(this.#path + 'count', new HttpOptions(this.#queryStr(query))).pipe(map((data) => data['count']));
  }

  getFacet(query: SearchQuery): Observable<ArchiveFacet> {
    return this.#http.get<ArchiveFacet>(this.#path + 'facet', new HttpOptions(this.#queryStr(query)));
  }
}
