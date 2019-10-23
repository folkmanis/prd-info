import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ArchiveSearchService } from '../services/archive-search.service';
import { ArchiveSearch, SearchRecord } from '../services/archive-response';


@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css']
})
export class SearchTableComponent implements OnInit {
  @Input() search$: Observable<string>;

  count: number;
  archiveSearch: SearchRecord[];

  constructor(
    private snack: MatSnackBar,
    private archiveSearchService: ArchiveSearchService,
  ) { }

  ngOnInit() {
    this.search$.pipe(
      switchMap((q) => this.archiveSearchService.getSearchResult(q))
    ).
    subscribe((val) => {
      this.archiveSearch = val.data || [];
      this.count = val.count;
    });
  }

  onCopied(val: string) {
    this.snack.open('Pārkopēts starpliktuvē: ' + val, 'OK', {duration: 3000});
  }

}
