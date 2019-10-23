/**
 * data/xmf-search/search?q=<string>
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpOptions } from './http-options';
import { ArchiveResp } from './archive-response';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private httpPathSearch = '/data/xmf-search/';
  constructor(
    private http: HttpClient,
  ) { }

  searchHttp(query: {q: string}): Observable<ArchiveResp> {
    return this.http.get<ArchiveResp>(this.httpPathSearch + 'search', new HttpOptions(query));
  }
}
