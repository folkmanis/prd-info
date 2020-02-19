import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { ArchiveSearchService } from '../../services/archive-search.service';
import { SearchQuery, ArchiveFacet, FacetFilter } from '../../services/archive-search-class';
import { map, filter, switchMap, tap } from 'rxjs/operators';
import { pipe, Subscription } from 'rxjs';

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.css']
})
export class FacetComponent implements OnInit, OnDestroy {

  facet: ArchiveFacet;
  facetSubs: Subscription;
  facetChange: EventEmitter<Partial<FacetFilter>> = new EventEmitter();
  facetFilter: Partial<FacetFilter>;

  constructor(
    private archiveSearchService: ArchiveSearchService,
  ) { }

  ngOnInit() {
    this.facetFilter = {};
    this.archiveSearchService.facetFilter$ = this.facetChange;
    this.facetSubs = this.archiveSearchService.facetResult$.subscribe((res) => {
      this.facet = res;
    });
  }

  ngOnDestroy() {
    this.facetSubs.unsubscribe();
  }

  onFacet(event: MatSelectionListChange, key: 'customerName' | 'year' | 'month') {
    const selected = event.source.selectedOptions.selected;
    this.facetFilter[key] = selected.length ? selected.map((e) => e.value) : undefined; // Ja nekas nav atzīmēts, tad vispār nav
    this.facetChange.emit(this.facetFilter);
  }

  comp(o1, o2): boolean {
    return false;
  }

}
