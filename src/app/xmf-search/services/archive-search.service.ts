import { Injectable } from '@angular/core';

import { HttpService } from './http.service';
import { ArchiveResp, ArchiveRecord, PartialSearchQuery } from './archive-search-class';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArchiveSearchService {

  constructor(
    private httpService: HttpService,
  ) { }

  getCount(query: PartialSearchQuery): Observable<number> {
    return this.httpService.searchHttp(query).pipe(
      map((rec) => rec.count)
    );
  }

  getSearchResult(query: PartialSearchQuery): Observable<ArchiveResp> {
    return this.httpService.searchHttp(query);
  }

  // TODO pārveidot / par \

}
