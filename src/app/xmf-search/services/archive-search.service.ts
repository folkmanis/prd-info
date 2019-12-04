import { Injectable } from '@angular/core';

import { HttpService } from './http.service';
import { ArchiveResp, ArchiveRecord, SearchQuery, ArchiveFacet } from './archive-search-class';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArchiveSearchService {

  archiveSearchResult$: Subject<ArchiveRecord[]> = new Subject();
  count$ = new Subject<number>();
  private _search: SearchQuery = { q: '' };

  constructor(
    private httpService: HttpService,
  ) { }


  set search(s: SearchQuery) {
    for (const key in s) {
      if (s.hasOwnProperty(key)) {
        this._search[key] = s[key];
      }
    }
    this.getSearchResult(this._search).subscribe((res) => {
      this.count$.next(res.count);
      if (res.data && res.data.length > 0) {
        this.archiveSearchResult$.next(res.data);
      }
    })
  }
  get search(): SearchQuery {
    return this._search;
  }

  getCount(query: SearchQuery): Observable<number> {
    return this.httpService.searchHttp(query).pipe(
      map((rec) => rec.count)
    );
  }

  getSearchResult(query: SearchQuery): Observable<ArchiveResp> {
    return this.httpService.searchHttp(query).pipe(
      map((result) => replaceSlash(result))
    );
  }

  getFacet(query: SearchQuery): Observable<ArchiveFacet> {
    return this.httpService.facetHttp(query);
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