import { Component, OnInit, Input, Output } from '@angular/core';
import { ArchiveSearchService } from '../../services/archive-search.service';
import {SearchQuery, ArchiveFacet } from '../../services/archive-search-class';
import { map, filter, switchMap, tap} from 'rxjs/operators';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.css']
})
export class FacetComponent implements OnInit {

  @Input('query')
  public set query(_q: SearchQuery) {
    this.q = _q;
    console.log(this.q);
    this.archiveSearchService.getFacet(this.q)
    .pipe(
      tap((facet) => console.log(facet))
    )
    .subscribe((facet) => this.facet = facet);
  }

  q: SearchQuery;
  facet: ArchiveFacet;

  constructor(
    private archiveSearchService: ArchiveSearchService,
  ) { }

  ngOnInit() {
  }

}
