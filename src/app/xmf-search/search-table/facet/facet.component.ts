import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, AfterContentInit, AfterViewInit } from '@angular/core';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { ArchiveSearchService } from '../../services/archive-search.service';
import { ArchiveFacet, FacetFilter } from '../../services/archive-search-class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.css']
})
export class FacetComponent implements OnInit, OnDestroy, AfterViewInit {
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
    /** Nodod facet filtru servisam (serviss parakstās uz izmaiņām) */
    this.archiveSearchService.setFacetFilter(this.facetChange);
    /** Parakstās uz facet rezultātiem */
    this.facetSubs = this.archiveSearchService.facetResult$
      .subscribe(res => this.facet = res);
  }

  ngAfterViewInit () {
    /** Kad jauns meklējums, tad visi filtri tiek noņemti */
    this.resetSubs = this.archiveSearchService.resetFacet.subscribe(() => {
      this.month.deselectAll();
      this.year.deselectAll();
      this.customerName.deselectAll();
    });
  }
  
  ngOnDestroy() {
    this.facetSubs.unsubscribe();
    this.resetSubs.unsubscribe();
    /** Paziņo servisam, ka var atrakstīties */
    this.archiveSearchService.unsetFacetFilter();
  }

  onFacet(event: MatSelectionListChange, key: 'customerName' | 'year' | 'month') {
    const selected = event.source.selectedOptions.selected;
    const filter: Partial<FacetFilter> = {};
    filter[key] = selected.length ? selected.map((e) => e.value) : undefined; // Ja nekas nav atzīmēts, tad vispār nav
    this.facetChange.emit(filter);
  }

}
