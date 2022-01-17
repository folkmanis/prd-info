import { Injectable } from '@angular/core';
import { deepCopy } from 'prd-cdk';
import { concat, MonoTypeOperatorFunction, Observable, of, OperatorFunction, pipe, ReplaySubject } from 'rxjs';
import { filter, map, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ArchiveFacet, ArchiveRecord, SearchQuery } from '../interfaces';
import { PagedCache } from './paged-cache';
import { SearchData } from './search-data';
import { XmfArchiveApiService } from './xmf-archive-api.service';

@Injectable()
export class ArchiveSearchService {

  private readonly query$ = new ReplaySubject<SearchQuery>(1);

  count$: Observable<number | undefined> = this.query$.pipe(
    switchMap(query => concat(of(undefined), this.api.getCount(query))),
    shareReplay(1),
  );

  archive$: Observable<SearchData> = this.count$.pipe(
    filter(count => count !== undefined),
    withLatestFrom(this.query$),
    map(([count, q]) => new PagedCache<ArchiveRecord>(count, this.fetchRecords(q))),
    map(cache => new SearchData(cache))
  );

  facet$: Observable<ArchiveFacet> = this.query$.pipe(
    facetCache(query => this.api.getFacet(query)),
  );

  constructor(
    private api: XmfArchiveApiService,
  ) { }

  setQuery(query: SearchQuery) {
    this.query$.next(query);
  }


  private fetchRecords(query: SearchQuery): (start: number, limit: number) => Observable<ArchiveRecord[]> {
    return (start, limit) => this.api.getArchive(query, start, limit);
  }

}


function facetCache(fetchFn: (query: SearchQuery) => Observable<ArchiveFacet>): OperatorFunction<SearchQuery, ArchiveFacet> {
  let query = new SearchQuery();
  let facetData: ArchiveFacet | undefined;
  return pipe(
    tap(newQuery => newQuery.q !== query.q && facetData === undefined),
    tap(newQuery => query = newQuery),
    switchMap(newQuery => fetchFn(newQuery)),
    map(newFacet => {
      if (!facetData) { // ja prasa pirmo reizi
        facetData = newFacet; // tad izmanto visu ierakstu
        return deepCopy(facetData);
      }
      // ja elementi jau ir, tad izmantos tikai skaitus
      const facetFiltered: ArchiveFacet = deepCopy(facetData);
      for (const key of Object.keys(facetFiltered)) { // pa grupām
        facetFiltered[key] = facetFiltered[key].map(val => newFacet[key].find(nVal => nVal._id === val._id) || { ...val, count: 0 });
      }
      return facetFiltered;
    }),
  );
}

