import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Observable, combineLatest } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay, distinctUntilChanged, debounceTime, tap, startWith } from 'rxjs/operators';
import { ArchiveSearchService } from './services/archive-search.service';

@Component({
  selector: 'app-xmf-search',
  templateUrl: './xmf-search.component.html',
  styleUrls: ['./xmf-search.component.css']
})
export class XmfSearchComponent implements OnInit, OnDestroy, AfterViewInit {

  searchForm = new FormGroup({
    q: new FormControl(''),
  });

  constructor(
    private breakpointObserver: BreakpointObserver,
    private service: ArchiveSearchService,
    private viewport: ViewportRuler,
  ) { }
  value$: Observable<string> = this.searchForm.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    map(params => <string>params.q),
    map(q => q.trim()),
    shareReplay(1),
  );
  isValue$: Observable<boolean> = this.value$.pipe(
    map(val => val.length > 0)
  );
  isFacet$: Observable<boolean> = combineLatest(
    this.breakpointObserver.observe(Breakpoints.Handset),
    this.value$
  ).pipe(
    map(([handset, val]) => !handset.matches && val.length > 0)
  );
  facetHeight$: Observable<number> = this.viewport.change(200).pipe(
    startWith({}),
    map(() => this.viewport.getViewportSize()),
    tap(console.log),
    map(size => size.height - 64 - 100),
  );

  ngOnInit() {
    this.service.setSearch(
      this.value$
    );
  }

  ngOnDestroy() {
    this.service.unsetSearch();
  }

  ngAfterViewInit() {
    setTimeout(() =>
      this.searchForm.setValue({ q: '114' }), 200 // DEBUG!!!
    );
  }
}
