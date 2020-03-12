/**
 * Saņem multicast plūsmas:
 * search$ - plūsma ar meklējumu
 * facet$ - Facet filtra izmaiņas
 * 
 * Izsniedz multicast plūsmas:
 * searchResult$ - Meklēšanas rezultātu tabula
 * count$ - kopējais skaits
 * facet$ - Facet rezultāts
 * 
 * 
 */

import { Injectable, EventEmitter } from '@angular/core';

import { ArchiveResp, ArchiveRecord, SearchQuery, ArchiveFacet, FacetFilter } from './archive-search-class';
import { Observable, Subject, BehaviorSubject, combineLatest, ReplaySubject, OperatorFunction, Subscription, merge, of } from 'rxjs';
import { map, tap, switchMap, share, pluck, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from '../../library/http/http-options';

@Injectable({
  providedIn: 'root'
})
export class ArchiveSearchService {
  private httpPathSearch = '/data/xmf-search/';
  constructor(
    private http: HttpClient,
  ) { }

  private _searchString$ = new ReplaySubject<string>(1); // ienākošā meklējuma rinda
  private facetSearch$ = new BehaviorSubject<Partial<FacetFilter>>({}); // ienākošais facet filtrs
  private searchQuery$: Observable<ArchiveResp> = combineLatest(this._searchString$, this.facetSearch$)
    .pipe(
      map(this.combineSearch()),
      switchMap(q => this.searchHttp(q)),
      share(),
    );
  private searchSubs: Subscription;
  private facetFilter: Partial<FacetFilter> = {};
  private facetSubs: Subscription;
  // count$ = new Subject<number>();
  resetFacet = new EventEmitter<void>();

  setSearch(s$: Observable<string>) {
    this.unsetSearch();
    this.searchSubs = s$.pipe(
      tap(() => this.facetFilter = {}),
      tap(() => this.resetFacet.next()), // Būs vajadzīgs jauns facet
    ).subscribe(this._searchString$);
  }

  get searchString$(): Observable<string> {
    return this._searchString$;
  }

  unsetSearch(): void {
    this.searchSubs && this.searchSubs.unsubscribe();
  }

  setFacetFilter(f$: Observable<Partial<FacetFilter>>) {
    this.unsetFacetFilter();
    this.facetSubs = f$.pipe(
      tap(f => this.facetFilter = { ...this.facetFilter, ...f }),
    ).subscribe(this.facetSearch$);
  }

  unsetFacetFilter(): void {
    this.facetSubs && this.facetSubs.unsubscribe();
  }
  count$: Observable<number> = merge(
    of(0),
    this.searchQuery$.pipe(map(res => res.count),)
  ).pipe(
    shareReplay(1),
  );

  searchResult$: Observable<ArchiveRecord[]> = this.searchQuery$.pipe(
    map(res => res.data),
    tap(this.replaceSlash),
  );

  facetResult$: Observable<ArchiveFacet> = this.searchQuery$.pipe(
    pluck('facet'),
    this.updateFacet(this.resetFacet),
    shareReplay(1),
  );

  private updateFacet(reset: Observable<void>): (nF: Observable<ArchiveFacet>) => Observable<ArchiveFacet> {
    let lastFacet: ArchiveFacet;
    reset.subscribe(() => lastFacet = undefined);
    return map(
      (newFacet: ArchiveFacet): ArchiveFacet => {
        if (!lastFacet) { // ja prasa pirmo reizi
          lastFacet = newFacet; // tad izmanto visu ierakstu
        } else { // ja elementi jau ir, tad izmantos tikai skaitus
          for (const key of Object.keys(newFacet)) { // pa grupām
            const nFGr: Array<any> = newFacet[key];
            const oFGr: Array<any> = lastFacet[key];
            for (const k in oFGr) {
              const idxNew = nFGr.findIndex(el => el['_id'] === oFGr[k]['_id']);
              oFGr[k]['count'] = (idxNew > -1) ? nFGr[idxNew]['count'] : oFGr[k]['count'] = 0;
            }
          }
        }
        return lastFacet;
      }
    );
  }

  private combineSearch(): (params: [string, Partial<FacetFilter>]) => SearchQuery {
    let lastString = '';
    return ([q, fac]): SearchQuery => {
      if (q !== lastString) {
        lastString = q;
        this.facetFilter = {};
      }
      return { q: lastString, ...this.facetFilter };
    };
  }

  private searchHttp(query: SearchQuery): Observable<ArchiveResp> {
    return this.http.get<ArchiveResp>(this.httpPathSearch + 'search', new HttpOptions({ query: JSON.stringify(query) }));
  }

  private replaceSlash(data: ArchiveRecord[]) {
    for (const rec of data) {
      for (const arch of rec.Archives || []) {
        arch.Location = arch.Location.replace(/\//g, '\\');
      }
    }
  }

}
