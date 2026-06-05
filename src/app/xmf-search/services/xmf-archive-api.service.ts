import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { ValidatorService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http/http-options';
import { z } from 'zod';
import { ArchiveFacet, ArchiveFacetSchema, ArchiveRecord, SearchFilter, searchFilterToQuery } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class XmfArchiveApiService {
  #path = getAppParams('apiPath') + 'xmf-search/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  getXmfCustomers(): Observable<string[]> {
    return this.#http
      .get(this.#path + 'customers', new HttpOptions())
      .pipe(map(this.#validator.arrayValidatorFn(z.string())));
  }

  async getArchive(filter: SearchFilter, start?: number, limit?: number): Promise<ArchiveRecord[]> {
    const query = searchFilterToQuery.encode(filter);
    const data$ = this.#http.get(this.#path, new HttpOptions({ ...query, start, limit }));
    return this.#validator.validateArrayAsync(ArchiveRecord, data$);
  }

  getCount(filter: SearchFilter): Observable<number> {
    const query = searchFilterToQuery.encode(filter);
    return this.#http.get(this.#path + 'count', new HttpOptions(query)).pipe(
      map(this.#validator.validatorFn(z.object({ count: z.number() }))),
      map((data) => data.count),
    );
  }

  getFacet(filter: SearchFilter): Observable<ArchiveFacet> {
    const query = searchFilterToQuery.encode(filter);
    return this.#http
      .get(this.#path + 'facet', new HttpOptions(query))
      .pipe(map(this.#validator.validatorFn(ArchiveFacetSchema)));
  }
}
