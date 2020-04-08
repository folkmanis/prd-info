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

import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { map, mergeMap, pluck, share, shareReplay, switchMap, tap } from 'rxjs/operators';
import { HttpOptions } from '../../library/http/http-options';
import { ArchiveFacet, ArchiveRecord, ArchiveResp, FacetFilter, SearchQuery } from './archive-search-class';
import { PagedCache, Range } from './paged-cache';

@Injectable()
export class ArchiveSearchService {
  private httpPathSearch = '/data/xmf-search/';
  constructor(
    private http: HttpClient,
  ) { }

  private _stringSearch$ = new ReplaySubject<string>(1); // ienākošā meklējuma rinda
  private _facetSearch$ = new BehaviorSubject<Partial<FacetFilter>>({}); // ienākošais facet filtrs
  private _cachedQuery: SearchQuery | undefined;
  private _cache: PagedCache<ArchiveRecord>;
  private searchQuery$: Observable<ArchiveResp> = combineLatest([this._stringSearch$, this._facetSearch$])
    .pipe(
      map(this.combineSearch()),
      switchMap(q => this.searchHttp(q)),
      tap(re => this._cache = new PagedCache<ArchiveRecord>(re.count, this.fetchRecords(), re.data)),
      shareReplay(1),
    );
  private searchSubs: Subscription;
  private facetFilter: Partial<FacetFilter> = {};
  private facetData: ArchiveFacet | null;
  private facetSubs: Subscription;
  fetchRange = new EventEmitter<Range>();

  count$: Observable<number> = merge(
    of(0),
    this.searchQuery$.pipe(map(res => res.count))
  ).pipe(
    share(),
  );

  searchResult$: Observable<ArchiveRecord[]> = this.searchQuery$.pipe(
    map(res => res.data),
    share(),
  );

  facetResult$: Observable<ArchiveFacet> = this.searchQuery$.pipe(
    pluck('facet'),
    this.updateFacet(),
    share(),
  );

  setSearch(s$: Observable<string>) {
    this.unsetSearch();
    this.searchSubs = s$.pipe(
      tap(() => this.facetFilter = {}),
      tap(() => this.facetData = null), // Būs vajadzīgs jauns facet
    ).subscribe(this._stringSearch$);
  }

  get searchString$(): Observable<string> {
    return this._stringSearch$;
  }

  unsetSearch(): void {
    this.searchSubs?.unsubscribe();
  }

  setFacetFilter(f$: Observable<Partial<FacetFilter>>) {
    this.unsetFacetFilter();
    this.facetSubs = f$.pipe(
      tap(f => this.facetFilter = { ...this.facetFilter, ...f }),
    ).subscribe(this._facetSearch$);
  }

  unsetFacetFilter(): void {
    this.facetSubs?.unsubscribe();
  }
  private updateFacet(): (nF: Observable<ArchiveFacet>) => Observable<ArchiveFacet> {
    return map(
      (newFacet: ArchiveFacet): ArchiveFacet => {
        if (!this.facetData) { // ja prasa pirmo reizi
          this.facetData = newFacet; // tad izmanto visu ierakstu
        } else { // ja elementi jau ir, tad izmantos tikai skaitus
          for (const key of Object.keys(newFacet)) { // pa grupām
            const nFGr: Array<any> = newFacet[key];
            const oFGr: Array<any> = this.facetData[key];
            for (const k in oFGr) {
              if (oFGr.hasOwnProperty(k)) {
                const idxNew = nFGr.findIndex(el => el._id === oFGr[k].id);
                oFGr[k].count = (idxNew > -1) ? nFGr[idxNew].count : oFGr[k].count = 0;
              }
            }
          }
        }
        return this.facetData;
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
    const serv: ArchiveSearchService = this;
    return (start: number, limit: number): Observable<ArchiveRecord[]> => {
      return serv._cachedQuery ? serv.searchHttp(serv._cachedQuery, start, limit) : of([]);
    };
  }

  private searchHttp(query: SearchQuery): Observable<ArchiveResp>;
  private searchHttp(query: SearchQuery, start: number, limit?: number): Observable<ArchiveRecord[]>;
  private searchHttp(query: SearchQuery, start?: number, limit = 100): Observable<ArchiveResp | ArchiveRecord[]> {
    this._cachedQuery = query;
    if (start) {
      return this.http.get<Partial<ArchiveResp>>(
        this.httpPathSearch + 'search',
        new HttpOptions({ query: JSON.stringify(query), start, limit })
      )
        .pipe(
          map(resp => resp.data || []),
          tap(this.replaceSlash),
        );
    } else {
      return this.http.get<ArchiveResp>(this.httpPathSearch + 'search', new HttpOptions({ query: JSON.stringify(query) })).pipe(
        tap((resp: ArchiveResp) => this.replaceSlash(resp.data))
      );
    }
  }

  private replaceSlash(data: ArchiveRecord[]) {
    for (const rec of data) {
      for (const arch of rec.Archives || []) {
        arch.Location = arch.Location.replace(/\//g, '\\');
      }
    }
  }

}
