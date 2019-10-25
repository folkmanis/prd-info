import { Injectable } from '@angular/core';

import { HttpService } from './http.service';
import { ArchiveResp, ArchiveSearch, ArchiveRecord, SearchRecord, PartialSearchQuery } from './archive-search-class';
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

  getArchiveResps(query: PartialSearchQuery): Observable<ArchiveResp> {
    return this.httpService.searchHttp(query);
  }

  getSearchResult(query: PartialSearchQuery): Observable<ArchiveSearch> {
    return this.httpService.searchHttp(query).pipe(
      map(({ count, data }) => ({ count, data: this.archiveToSearch(data) }))
    );

  }
/**
 * Datubāzes ierakstus pārveido par attēlojamiem ierakstiem
 * @param arch ieraksts no datubāzes
 */
  private archiveToSearch(arch: ArchiveRecord[]): SearchRecord[] {
    const search: SearchRecord[] = [];
    let idx: number = null;
    let newRec: SearchRecord;
    arch.forEach((rec) => {
      if (idx !== rec.id) {
        idx = rec.id;
        newRec = {
          id: rec.id,
          jdfJobId: rec.jdfJobId,
          descriptiveName: rec.descriptiveName,
          customerName: rec.customerName,
          archive: []
        };
        search.push(newRec);
      }
      if (rec.action) {
        newRec.archive.push({
          location: rec.location,
          action: rec.action,
          date: rec.date,
          datums: rec.location.split('\\')[3],
        });
      }
    });
    return search;
  }
}
