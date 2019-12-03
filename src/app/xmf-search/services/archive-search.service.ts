import { Injectable } from '@angular/core';

import { HttpService } from './http.service';
import { ArchiveResp, ArchiveRecord, PartialSearchQuery, ArchiveFacet } from './archive-search-class';
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
    return this.httpService.searchHttp(query).pipe(
      map((result) => {
        if (result.data && result.data.length > 0) {
          result.data = result.data.map((val) => {
            if (val.Archives) {
              val.Archives = val.Archives.map((arch) => {
                arch.Location = arch.Location.replace(/\//g, '\\');
                return arch;
              });
            }
            return val;
          });
        }
        return result;
      })
    );
  }

  getFacet(query: PartialSearchQuery): Observable<ArchiveFacet> {
    return this.httpService.facetHttp(query);
  }

}
