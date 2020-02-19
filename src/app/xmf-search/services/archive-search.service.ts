/**
 * Saņem multicast plūsmas:
 * search$ - plūsma ar meklējumu
 * facet$ - Facet filtrs
 * 
 * Izsniedz multicast plūsmas:
 * searchResult$ - Meklēšanas rezultātu tabula
 * count$ - kopējais skaits
 * facet$ - Facet rezultāts
 * 
 * 
 */

import { Injectable } from '@angular/core';

import { ArchiveResp, ArchiveRecord, SearchQuery, ArchiveFacet, FacetFilter } from './archive-search-class';
import { Observable, Subject, BehaviorSubject, combineLatest, ReplaySubject } from 'rxjs';
import { map, tap, switchMap, share, pluck } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from '../../library/http/http-options';

@Injectable({
  providedIn: 'root'
})
export class ArchiveSearchService {

  private searchString$ = new ReplaySubject<string>(1); // ienākošā meklējuma rinda
  private facetSearch$ = new BehaviorSubject<Partial<FacetFilter>>({}); // ienākošais facet filtrs
  private searchQuery$: Observable<ArchiveResp> = combineLatest(this.searchString$, this.facetSearch$)
    .pipe(
      map(([q, fac]) => ({ q, ...fac })),
      switchMap(q => this.searchHttp(q)),
      share(),
    );
  private lastFacet: ArchiveFacet | null;
  private httpPathSearch = '/data/xmf-search/';
  count$ = new Subject<number>();

  constructor(
    private http: HttpClient,
  ) { }

  set search$(s$: Observable<string>) {
    s$.pipe(
      tap(() => this.lastFacet = null), // Būs vajadzīgs jauns facet
    ).subscribe(this.searchString$);
  }

  set facetFilter$(f$: Observable<Partial<FacetFilter>>) {
    f$.subscribe(this.facetSearch$);
  }

  searchResult$: Observable<ArchiveRecord[]> = this.searchQuery$.pipe(
    tap(res => this.count$.next(res.count)),
    map(res => res.data),
    tap(replaceSlash),
  );

  facetResult$: Observable<ArchiveFacet> = this.searchQuery$.pipe(
    pluck('facet'),
    map(this.updateFacet),
  );

  private updateFacet(newFacet: ArchiveFacet): ArchiveFacet {
    if (!this.lastFacet) { // ja prasa pirmo reizi
      this.lastFacet = newFacet; // tad izmanto visu ierakstu
    } else { // ja elementi jau ir, tad izmantos tikai skaitus
      for (const key of Object.keys(newFacet)) { // pa grupām
        const nFGr: Array<any> = newFacet[key];
        const oFGr: Array<any> = this.lastFacet[key];
        for (const k in oFGr) {
          const idxNew = nFGr.findIndex(el => el['_id'] === oFGr[k]['_id']);
          if (idxNew > -1) {
            oFGr[k]['count'] = nFGr[idxNew]['count'];
          } else {
            oFGr[k]['count'] = 0;
          }
        }
      }
    }
    return this.lastFacet;
  }

  private searchHttp(query: SearchQuery): Observable<ArchiveResp> {
    return this.http.get<ArchiveResp>(this.httpPathSearch + 'search', new HttpOptions({ query: JSON.stringify(query) }));
  }

}

const replaceSlash = function (data: ArchiveRecord[]) {
  for (const rec of data) {
    for (const arch of rec.Archives || []) {
      arch.Location = arch.Location.replace(/\//g, '\\');
    }
  }
};