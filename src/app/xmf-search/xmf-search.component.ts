import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';
import { ArchiveSearchService } from './services/archive-search.service';

@Component({
  selector: 'app-xmf-search',
  templateUrl: './xmf-search.component.html',
  styleUrls: ['./xmf-search.component.css'],
  providers: [ArchiveSearchService],
})
export class XmfSearchComponent implements OnInit, OnDestroy {
  q: FormControl = new FormControl('');

  constructor(
    private breakpointObserver: BreakpointObserver,
    private service: ArchiveSearchService,
    private viewport: ViewportRuler,
  ) { }
  value$: Observable<string> = this.q.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    map((q: string) => q.trim()),
    distinctUntilChanged(),
    shareReplay(1),
  );
  isFacet$: Observable<boolean> = combineLatest(
    this.breakpointObserver.observe(Breakpoints.Handset),
    this.value$
  ).pipe(
    map(([handset, val]) => !handset.matches)
  );
  facetHeight$: Observable<number> = this.viewport.change(200).pipe(
    startWith({}),
    map(() => this.viewport.getViewportSize()),
    map(size => size.height - 64 - 100),
  );

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

  ngOnInit() {
    this.service.setSearch(
      this.value$
    );
  }

  ngOnDestroy() {
    this.service.unsetSearch();
  }

}
