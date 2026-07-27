import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { httpFilter, httpParams, validatorFn } from 'src/app/library';
import { z } from 'zod';
import { ArchiveFacet, ArchiveFacetSchema, ArchiveRecord, SearchFilter, searchFilterToQuery } from '../interfaces';

@Service()
export class XmfArchiveApiService {
  #path = getAppParams('apiPath') + 'xmf-search/';
  #http = inject(HttpClient);

  getXmfCustomers(): Observable<string[]> {
    return this.#http.get(this.#path + 'customers').pipe(map(validatorFn(z.string().array())));
  }

  getArchive(filter: SearchFilter): Promise<ArchiveRecord[]> {
    const query = searchFilterToQuery.encode(filter);
    const data$ = this.#http.get(this.#path, httpParams(query)).pipe(map(validatorFn(ArchiveRecord.array())));
    return firstValueFrom(data$);
  }

  getCount(filter: SearchFilter): Observable<number> {
    const options = httpFilter(searchFilterToQuery, filter);
    return this.#http.get(this.#path + 'count', options).pipe(
      map(validatorFn(z.object({ count: z.number() }))),
      map((data) => data.count),
    );
  }

  getFacet(filter: SearchFilter): Observable<ArchiveFacet> {
    const options = httpFilter(searchFilterToQuery, filter);
    return this.#http.get(this.#path + 'facet', options).pipe(map(validatorFn(ArchiveFacetSchema)));
  }
}
