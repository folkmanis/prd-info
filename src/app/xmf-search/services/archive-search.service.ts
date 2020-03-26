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
 * 
 * 
 * 
 */

import { Injectable, EventEmitter } from '@angular/core';

import { ArchiveResp, ArchiveRecord, SearchQuery, ArchiveFacet, FacetFilter } from './archive-search-class';
import { Observable, Subject, BehaviorSubject, combineLatest, ReplaySubject, OperatorFunction, Subscription, merge, of, forkJoin } from 'rxjs';
import { map, tap, switchMap, share, pluck, shareReplay, mergeAll, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from '../../library/http/http-options';

export enum SERVICE_STATES {
  EMPTY, UPDATING, LOADED
}

interface Range {
  start: number;
  end: number;
}

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
  private searchQuery$: Observable<ArchiveResp> = combineLatest(this._stringSearch$, this._facetSearch$)
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
    this.searchSubs && this.searchSubs.unsubscribe();
  }

  setFacetFilter(f$: Observable<Partial<FacetFilter>>) {
    this.unsetFacetFilter();
    this.facetSubs = f$.pipe(
      tap(f => this.facetFilter = { ...this.facetFilter, ...f }),
    ).subscribe(this._facetSearch$);
  }

  unsetFacetFilter(): void {
    this.facetSubs && this.facetSubs.unsubscribe();
  }
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
              const idxNew = nFGr.findIndex(el => el['_id'] === oFGr[k]['_id']);
              oFGr[k]['count'] = (idxNew > -1) ? nFGr[idxNew]['count'] : oFGr[k]['count'] = 0;
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
      return this.http.get<Partial<ArchiveResp>>(this.httpPathSearch + 'search', new HttpOptions({ query: JSON.stringify(query), start, limit })).pipe(
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

/**
 * Cache objekts.
 */
class PagedCache<T> {
  private _cachedData: Array<T | undefined>;
  private _pageSize = 100;
  private _cachedPages = new Set<number>();
  /**
   * Konstruktors ar sākotnējiem iestatījumiem
   * @param _length Kopējais objektu skaits. Sākotnēji var būt nepiepildīts
   * @param _fetchFunction Funkcija, kas iegūs datus. Atgriež datu Observable, kuram ir jāpabeidzas
   * @param firstPage Pirmā datu porcija, ja tāda ir. Jābūt tieši 100 objektiem (vienai lapai)
   */
  constructor(
    private _length: number,
    private _fetchFunction: (start: number, limit: number) => Observable<T[]>,
    firstPage?: T[],
  ) {
    this._cachedData = Array.from({ length: this._length });
    if (firstPage && (firstPage.length === this._pageSize || firstPage.length === this._length)) {
      this._cachedData.splice(0, this._pageSize, ...firstPage);
      this._cachedPages.add(0);
    }
  }

  fetchRange(range: Range): Observable<Array<T | undefined>> {
    const startPage = this.getPageForIndex(range.start);
    const endPage = this.getPageForIndex(range.end);
    const fetch$: Observable<Array<T>>[] = [];
    for (let idx = startPage; idx <= endPage; idx++) {
      const f = this.fetchPage(idx);
      if (f) { fetch$.push(f); }
    }
    return fetch$.length ? forkJoin(fetch$).pipe(
      map(() => this._cachedData)
    ) : of(this._cachedData);
  }

  private fetchPage(page: number): Observable<T[]> | undefined {
    if (this._cachedPages.has(page)) {
      return;
    }
    this._cachedPages.add(page);
    const start = page * this._pageSize;
    return this._fetchFunction(start, this._pageSize).pipe(
      tap(data => this._cachedData.splice(start, data.length, ...data)),
    );
  }

  private getPageForIndex(idx: number): number {
    return Math.floor(idx / this._pageSize);
  }
}