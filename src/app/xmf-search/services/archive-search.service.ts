/**
 * Saņem multicast plūsmas:
 * search$ - plūsma ar meklējumu
 * facet$ - Facet filtra izmaiņas
 *
 *
 * Izsniedz multicast plūsmas:
 * searchResult$ - Meklēšanas rezultātu tabula
 * count$ - kopējais skaits
 * facetResult$ - Facet rezultāts
 */

import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, of, ReplaySubject } from 'rxjs';
import { map, mergeMap, pluck, share, shareReplay, switchMap, tap } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { HttpOptions } from '../../library/http/http-options';
import { ArchiveFacet, ArchiveRecord, ArchiveResp, FacetFilter, SearchQuery } from 'src/app/interfaces/xmf-search';
import { PagedCache, Range } from './paged-cache';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';

@Injectable()
export class ArchiveSearchService {
  constructor(
    private prdApi: PrdApiService,
  ) { }

  private _stringSearch$ = new ReplaySubject<string>(1); // ienākošā meklējuma rinda
  private _facetSearch$ = new BehaviorSubject<Partial<FacetFilter>>({}); // ienākošais facet filtrs
  private _cachedQuery: SearchQuery | undefined;
  private _cache: PagedCache<ArchiveRecord>;
  private searchQuery$: Observable<ArchiveResp> = combineLatest([this._stringSearch$, this._facetSearch$])
    .pipe(
      tap(() => this.busy$.next(true)),
      map(this.combineSearch()),
      switchMap(q => this.searchHttp(q)),
      tap(re => this._cache = new PagedCache<ArchiveRecord>(re.count, this.fetchRecords(), re.data)),
      tap(() => this.busy$.next(false)),
      shareReplay(1),
    );
  private facetFilter: Partial<FacetFilter> = {};
  private facetData: ArchiveFacet | null;
  fetchRange = new EventEmitter<Range>();

  busy$ = new BehaviorSubject<boolean>(true);

  count$: Observable<number> = merge(
    of(0),
    this.searchQuery$.pipe(map(res => res.count))
  ).pipe(
    share(),
  );

  searchResult$: Observable<ArchiveRecord[]> = this.searchQuery$.pipe(
    pluck('data'),
    share(),
  );

  facetResult$: Observable<ArchiveFacet> = this.searchQuery$.pipe(
    pluck('facet'),
    this.updateFacet(),
    share(),
  );

  setSearch(search: string) {
    this.facetFilter = {};
    this.facetData = null;
    this._stringSearch$.next(search);
  }

  setFacetFilter(f: Partial<FacetFilter>) {
    this.facetFilter = { ...this.facetFilter, ...f };
    this._facetSearch$.next(this.facetFilter);
  }

  get searchString$(): Observable<string> {
    return this._stringSearch$;
  }

  private updateFacet(): (nF: Observable<ArchiveFacet>) => Observable<ArchiveFacet> {
    return map(
      (newFacet: ArchiveFacet): ArchiveFacet => {
        if (!this.facetData) { // ja prasa pirmo reizi
          this.facetData = newFacet; // tad izmanto visu ierakstu
          return cloneDeep(this.facetData);
        }
        // ja elementi jau ir, tad izmantos tikai skaitus
        const facetFiltered: ArchiveFacet = cloneDeep(this.facetData);
        for (const key of Object.keys(facetFiltered)) { // pa grupām
          facetFiltered[key] = facetFiltered[key].map(val => newFacet[key].find(nVal => nVal._id === val._id) || { ...val, count: 0 });
        }
        return facetFiltered;
      }
    );
  }

  private combineSearch(): (params: [string, Partial<FacetFilter>]) => SearchQuery {
    let lastString: string | undefined;
    return ([q, fac]): SearchQuery => {
      if (q !== lastString) {
        lastString = q;
        this.facetFilter = {};
      }
      return { q: lastString, ...this.facetFilter };
    };
  }

  rangedData(range$: Observable<Range>): Observable<Array<ArchiveRecord | undefined>> {
    return combineLatest([this.searchQuery$, range$]).pipe(
      mergeMap(([_, range]) => this._cache.fetchRange(range)),
      share(),
    );
  }

  private fetchRecords(): (start: number, limit: number) => Observable<ArchiveRecord[]> {
    return (start: number, limit: number): Observable<ArchiveRecord[]> => this._cachedQuery ? this.searchHttp(this._cachedQuery, start, limit) : of([]);
  }

  private searchHttp(query: SearchQuery): Observable<ArchiveResp>;
  private searchHttp(query: SearchQuery, start: number, limit?: number): Observable<Partial<ArchiveRecord[]>>;
  private searchHttp(query: SearchQuery, start?: number, limit = 100): Observable<ArchiveResp | ArchiveRecord[]> {
    this._cachedQuery = query;
    if (start) {
      return this.prdApi.xmfArchive.getSearch(new HttpOptions({ query: JSON.stringify(query), start, limit }))
        .pipe(
          map(resp => resp.data || []),
          map(replaceSlash),
        );
    } else {
      return this.prdApi.xmfArchive.getSearch(new HttpOptions({ query: JSON.stringify(query) })).pipe(
        map(resp => ({
          ...resp,
          data: replaceSlash(resp.data),
        }))
      );
    }
  }

}

function replaceSlash(data: Partial<ArchiveRecord[]>): Partial<ArchiveRecord[]> {
  return data.map(rec => ({
    ...rec,
    Archives: (rec.Archives || []).map(arch => ({
      ...arch,
      Location: arch.Location.replace(/\//g, '\\')
    })
    )
  }));
}
