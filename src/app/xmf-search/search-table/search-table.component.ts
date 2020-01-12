import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  search = '';  // Tiek izmantots rezultātu izcelšanai
  archiveSearchResult$: Observable< ArchiveRecord[]> = this.archiveSearchService.archiveSearchResult$;
  query: SearchQuery;
  status = '';
  actions: string[] = [,'Archive', 'Restore', 'Skip','Delete'];

  constructor(
    private snack: MatSnackBar,
    private archiveSearchService: ArchiveSearchService,
    private route: ActivatedRoute,
  ) { }

  initialSearch$ = // sākotnējais meklējums
    this.route.paramMap.pipe(
      filter((param) => param.has('q')),
      filter((param) => param.get('q').trim().length > 3),
      map((param) => {
        this.query = { q: param.get('q').trim() };
        this.search = this.query.q; // q = jautājums
        return this.query;
      }),
    );

  ngOnInit() {
    this.archiveSearchService.count$.subscribe(c => this.setStatus(c));
    this.initialSearch$.subscribe(query => this.archiveSearchService.search = query);
  }

  onCopied(val: string) {
    this.snack.open('Pārkopēts starpliktuvē: ' + val, 'OK', { duration: 3000 });
  }

  private setStatus(count: number) {
    if (!count || count < 1) {
      this.status = 'Nav rezultātu';
    }
    const si = (count % 10 === 1 && count !== 11 ? 's' : 'i');
    this.status = `Atrast${si} ${count} ierakst${si}`;
    // if (count > this.archiveSearchResult.length) {
    //   ret += `, rāda ${this.archiveSearchResult.length}`;
    // }
  }

}
