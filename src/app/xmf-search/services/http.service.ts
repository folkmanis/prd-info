/**
 * data/xmf-search/search?q=<string>
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpOptions } from './http-options';
import { ArchiveResp, PartialSearchQuery } from './archive-search-class';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private httpPathSearch = '/data/xmf-search/';
  constructor(
    private http: HttpClient,
  ) { }

  searchHttp(query: PartialSearchQuery): Observable<ArchiveResp> {
    return this.http.get<ArchiveResp>(this.httpPathSearch + 'search', new HttpOptions(query));
  }
}
