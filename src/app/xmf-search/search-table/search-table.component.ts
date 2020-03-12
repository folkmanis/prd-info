import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, filter, switchMap, tap } from 'rxjs/operators';
import { merge, Observable } from 'rxjs/index';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ArchiveSearchService } from '../services/archive-search.service';
import { ArchiveRecord, SearchQuery, FacetFilter } from '../services/archive-search-class';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css']
})
export class SearchTableComponent implements OnInit {
  constructor(
    private snack: MatSnackBar,
    private service: ArchiveSearchService,
  ) { }

  archiveSearchResult$: Observable<ArchiveRecord[]> = this.service.searchResult$;
  query: SearchQuery;
  actions: string[] = [, 'Archive', 'Restore', 'Skip', 'Delete'];

  search$ = this.service.searchString$;

  ngOnInit() {
  }


  onCopied(val: string) {
    this.snack.open('Pārkopēts starpliktuvē: ' + val, 'OK', { duration: 3000 });
  }

  statuss$: Observable<string> = this.service.count$.pipe(
    map(count => {
      if (!count || count < 1) {
        return 'Nav rezultātu';
      } else {
        const si = (count % 10 === 1 && count !== 11 ? 's' : 'i');
        return `Atrast${si} ${count} ierakst${si}`;
      }
    })
  );

}
