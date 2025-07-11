import { Injectable, inject } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { Observable, OperatorFunction, pipe } from 'rxjs';
import { map, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ArchiveFacet, ArchiveRecord, SearchQuery } from '../interfaces';
import { PagedCache } from './paged-cache';
import { SearchData } from './search-data';
import { XmfArchiveApiService } from './xmf-archive-api.service';

@Injectable({
  providedIn: 'root',
})
export class ArchiveSearchService {
  private api = inject(XmfArchiveApiService);

  getCount(query: Observable<SearchQuery>): Observable<number> {
    return query.pipe(
      switchMap((q) => this.api.getCount(q)),
      shareReplay(1),
    );
  }

  getFacet(query: Observable<SearchQuery>): Observable<ArchiveFacet> {
    return query.pipe(facetCache((q) => this.api.getFacet(q)));
  }

  getData(query$: Observable<SearchQuery>, count$: Observable<number>): Observable<SearchData> {
    return count$.pipe(
      withLatestFrom(query$),
      map(([count, query]) => new PagedCache<ArchiveRecord>(count, this.fetchRecordsFn(query))),
      map((cache) => new SearchData(cache)),
    );
  }

  private fetchRecordsFn(query: SearchQuery): (start: number, limit: number) => Promise<ArchiveRecord[]> {
    return (start, limit) => this.api.getArchive(query, start, limit);
  }
}

function facetCache(fetchFn: (query: SearchQuery) => Observable<ArchiveFacet>): OperatorFunction<SearchQuery, ArchiveFacet> {
  let query = new SearchQuery();
  let facetData: ArchiveFacet | undefined;
  return pipe(
    tap((newQuery) => newQuery.q !== query.q && facetData === undefined),
    tap((newQuery) => (query = newQuery)),
    switchMap((newQuery) => fetchFn(newQuery)),
    map((newFacet) => {
      if (!facetData) {
        // ja prasa pirmo reizi
        facetData = newFacet; // tad izmanto visu ierakstu
        return cloneDeep(facetData);
      }
      // ja elementi jau ir, tad izmantos tikai skaitus
      const facetFiltered: ArchiveFacet = cloneDeep(facetData);
      for (const key of Object.keys(facetFiltered)) {
        // pa grupām
        facetFiltered[key] = facetFiltered[key].map((val) => newFacet[key].find((nVal) => nVal._id === val._id) || { ...val, count: 0 });
      }
      return facetFiltered;
    }),
  );
}
