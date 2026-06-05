import { Injectable, inject } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { Observable, OperatorFunction, pipe } from 'rxjs';
import { map, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ArchiveFacet, ArchiveRecord, SearchFilter } from '../interfaces';
import { PagedCache } from '../../library/rxjs/paged-cache';
import { SearchDataSource } from './search-data';
import { XmfArchiveApiService } from './xmf-archive-api.service';

@Injectable({
  providedIn: 'root',
})
export class ArchiveSearchService {
  private api = inject(XmfArchiveApiService);

  getCount(filter$: Observable<SearchFilter>): Observable<number> {
    return filter$.pipe(
      switchMap((q) => this.api.getCount(q)),
      shareReplay(1),
    );
  }

  getFacet(filter$: Observable<SearchFilter>): Observable<ArchiveFacet> {
    return filter$.pipe(facetCache((q) => this.api.getFacet(q)));
  }

  getData(filter$: Observable<SearchFilter>, count$: Observable<number>): Observable<SearchDataSource<ArchiveRecord>> {
    return count$.pipe(
      withLatestFrom(filter$),
      map(([count, filter]) => new PagedCache<ArchiveRecord>(count, this.fetchRecordsFn(filter))),
      map((cache) => new SearchDataSource(cache)),
    );
  }

  private fetchRecordsFn(filter: SearchFilter): (start: number, limit: number) => Promise<ArchiveRecord[]> {
    return (start, limit) => this.api.getArchive(filter, start, limit);
  }
}

function facetCache(
  fetchFn: (filter: SearchFilter) => Observable<ArchiveFacet>,
): OperatorFunction<SearchFilter, ArchiveFacet> {
  let filter: SearchFilter = { search: '', facet: {} };
  let facetData: ArchiveFacet | undefined;
  return pipe(
    tap((newFilter) => newFilter.search !== filter.search && facetData === undefined),
    tap((newFilter) => (filter = newFilter)),
    switchMap((newFilter) => fetchFn(newFilter)),
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
        facetFiltered[key as keyof ArchiveFacet] = facetFiltered[key as keyof ArchiveFacet].map(
          (val) => newFacet[key as keyof ArchiveFacet].find((nVal) => nVal._id === val._id) || { ...val, count: 0 },
        );
      }
      return facetFiltered;
    }),
  );
}
