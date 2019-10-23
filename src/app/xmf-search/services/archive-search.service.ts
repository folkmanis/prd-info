import { Injectable } from '@angular/core';

import { HttpService } from './http.service';
import { ArchiveResp, ArchiveSearch, ArchiveRecord, SearchRecord } from './archive-response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArchiveSearchService {

  constructor(
    private httpService: HttpService,
  ) { }

  getCount(query: string): Observable<number> {
    return this.httpService.searchHttp({ q: query }).pipe(
      map((rec) => rec.count)
    );
  }

  getArchiveResps(query: string): Observable<ArchiveResp> {
    return this.httpService.searchHttp({ q: query });
  }

  getSearchResult(query: string): Observable<ArchiveSearch> {
    return this.httpService.searchHttp({ q: query }).pipe(
      map(({ count, data }) => ({ count, data: this.archiveToSearch(data) }))
    );

  }

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
