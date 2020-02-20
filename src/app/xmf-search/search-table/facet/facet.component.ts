import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
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
  @ViewChild('month') month: MatSelectionList;
  @ViewChild('year') year: MatSelectionList;
  @ViewChild('customerName') customerName: MatSelectionList;

  facet: ArchiveFacet = { year: [], month: [], customerName: [] };
  facetSubs: Subscription;
  resetSubs: Subscription;
  facetChange: EventEmitter<Partial<FacetFilter>> = new EventEmitter();

  constructor(
    private archiveSearchService: ArchiveSearchService,
  ) { }

  ngOnInit() {
    this.archiveSearchService.facetFilter$ = this.facetChange;
    this.facetSubs = this.archiveSearchService.facetResult$.subscribe((res) => {
      this.facet = res;
    });
    this.resetSubs = this.archiveSearchService.resetFacet.subscribe(() => {
      this.month.deselectAll();
      this.year.deselectAll();
      this.customerName.deselectAll();
    });
  }

  ngOnDestroy() {
    this.facetSubs.unsubscribe();
    this.resetSubs.unsubscribe();
  }

  onFacet(event: MatSelectionListChange, key: 'customerName' | 'year' | 'month') {
    const selected = event.source.selectedOptions.selected;
    const filter: Partial<FacetFilter> = {};
    filter[key] = selected.length ? selected.map((e) => e.value) : undefined; // Ja nekas nav atzīmēts, tad vispār nav
    this.facetChange.emit(filter);
  }

}
