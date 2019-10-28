import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, filter, switchMap} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ArchiveSearchService } from '../services/archive-search.service';
import { SearchRecord, PartialSearchQuery } from '../services/archive-search-class';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css']
})
export class SearchTableComponent implements OnInit {

  count: number;
  search = '';
  archiveSearch: SearchRecord[];
  status = '';

  constructor(
    private snack: MatSnackBar,
    private archiveSearchService: ArchiveSearchService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      filter((param) => param.has('q')),
      filter((param) => param.get('q').length > 3),
      map((param) => {
        const search: PartialSearchQuery = {};
        this.search = search.q = param.get('q'); // q = jautājums
        if (param.get('zmg')) {  // zmg = tikai zemgus
          search.customers = ['Zemgus', 'PD'];
        }
        return search;
      }),
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
