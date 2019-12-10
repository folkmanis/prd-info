import { Component, OnInit, Input, Output } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { ArchiveSearchService } from '../../services/archive-search.service';
import { SearchQuery, ArchiveFacet, FacetFilter } from '../../services/archive-search-class';
import { map, filter, switchMap, tap } from 'rxjs/operators';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.css']
})
export class FacetComponent implements OnInit {

  facet: ArchiveFacet;

  constructor(
    private archiveSearchService: ArchiveSearchService,
  ) { }

  ngOnInit() {
    this.archiveSearchService.facet$.subscribe((res) => {
      this.facet = res;
    });
  }

  onFacet(event: MatSelectionListChange, key: string) {
    const facet: string[] | number[] =
      event.source.selectedOptions.selected.map((e) => e.value);
    this.archiveSearchService.setFacetFilter(key, facet);
  }

  comp(o1, o2): boolean {
    return false;
  }

}
