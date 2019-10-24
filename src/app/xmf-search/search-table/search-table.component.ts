import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter, switchMap, tap } from 'rxjs/operators';
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
  search = '';
  archiveSearch: SearchRecord[];
  status = '';

  constructor(
    private snack: MatSnackBar,
    private archiveSearchService: ArchiveSearchService,
  ) { }

  ngOnInit() {
    this.search$.pipe(
      tap((q) => this.search = q),
      switchMap((q) => this.archiveSearchService.getSearchResult(q))
    ).
      subscribe((val) => {
        this.archiveSearch = val.data || [];
        this.status = this.setStatus(val.count);
        this.count = val.count;
      });
  }

  onCopied(val: string) {
    this.snack.open('Pārkopēts starpliktuvē: ' + val, 'OK', { duration: 3000 });
  }

  private setStatus(count: number): string {
    if (!count || count < 1) {
      return 'Nav rezultātu';
    }
    const si = (count % 10 === 1 ? 's' : 'i');
    let ret = `Atrast${si} ${count} ierakst${si}`;
    if (count > this.archiveSearch.length) {
      ret += `, rāda ${this.archiveSearch.length}`;
    }
    return ret;
  }

}
