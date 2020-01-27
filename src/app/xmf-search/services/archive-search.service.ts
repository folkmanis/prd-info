import { Injectable } from '@angular/core';

import { HttpService } from './http.service';
import { ArchiveResp, ArchiveRecord, SearchQuery, ArchiveFacet, FacetFilter } from './archive-search-class';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArchiveSearchService {

  archiveSearchResult$: Subject<ArchiveRecord[]> = new Subject();
  count$ = new Subject<number>();
  facet$ = new Subject<ArchiveFacet>();
  private facet: ArchiveFacet;  // Vietējais mainīgais, kas satur facet
  private _search: SearchQuery;
  private _fsearch: SearchQuery;

  facetFilter: FacetFilter;

  constructor(
    private httpService: HttpService,
  ) { }


  set search(s: SearchQuery) {
    this._search = { q: '' };
    this._fsearch = { q: '' };
    for (const key in s) {
      if (s.hasOwnProperty(key)) {
        this._search[key] = s[key];
        this._fsearch[key] = s[key];
      }
    }
    this.initFacet();
    this.getSearchResult();
    this.getFacet();
  }
  get search(): SearchQuery {
    return this._search;
  }

  initFacet() {
    this.facetFilter = {
      customerName: [],
      year: [],
      month: [],
    }
    this.facet = {
      customerName: [],
      year: [],
      month: [],
    }
  }

  getCount(query: SearchQuery): Observable<number> {
    return this.httpService.searchHttp(query).pipe(
      map((rec) => rec.count)
    );
  }

  private getSearchResult() {
    return this.httpService.searchHttp(this._search).pipe(
      map((result) => replaceSlash(result)),
    ).subscribe((res) => {
      this.count$.next(res.count);
      if (res.data && res.data.length > 0) {
        this.archiveSearchResult$.next(res.data);
      } else {
        this.archiveSearchResult$.next([]);
      }
    });
  }

  private getFacet() {
    this.httpService.facetHttp(this._search)
      .subscribe((res) => {
        if (!this.getFacetLength()) { // ja prasa pirmo reizi
          this.facet = res; // tad atbildi saglabā atkārtotai lietošanai
        } else { // ja elementi jau ir, tad izmantos tikai skaitus
          for (const key of Object.keys(res)) { // pa grupām
            const nFGr: any[] = res[key];
            const oFGr: any[] = this.facet[key];
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
        this.facet$.next(this.facet);
      });
  }

  setFacetFilter(key: string, value: string[] | number[]) {
    if (this.facetFilter[key]) {
      this.facetFilter[key] = value;
      this._search[key] = value.length ? value : undefined;
    }
    this.getSearchResult();
    this.getFacet();
  }

  getFacetLength(): number {  // elementu skaits facet masīvā
    let sum = 0;
    for (const key of Object.keys(this.facet)) {
      sum += this.facet[key].length;
    }
    return sum;
  }

}

const replaceSlash = function (result: ArchiveResp): ArchiveResp {
  if (!result.data || result.data.length === 0) {
    return result;
  }
  result.data = result.data.map((val) => {
    if (val.Archives) {
      val.Archives = val.Archives.map((arch) => {
        arch.Location = arch.Location.replace(/\//g, '\\');
        return arch;
      });
    }
    return val;
  });
  return result;
}