import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FacetComponent } from './facet/facet.component';
import { FacetFilter, SearchQuery } from './interfaces';
import { ArchiveSearchService } from './services/archive-search.service';

@Component({
  selector: 'app-xmf-search',
  templateUrl: './xmf-search.component.html',
  styleUrls: ['./xmf-search.component.scss'],
  providers: [ArchiveSearchService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmfSearchComponent implements OnInit {

  @ViewChild(FacetComponent) facetComponent: FacetComponent;

  count$ = this.service.count$;
  facet$ = this.service.facet$;

  query: SearchQuery;

  constructor(
    private service: ArchiveSearchService,
  ) { }

  ngOnInit() {
    this.query = new SearchQuery();
  }

  onSearch(search: string) {
    this.query = new SearchQuery(search);
    this.facetComponent.onDeselectAll();
    this.service.setQuery(this.query);
  }

  onFacet(facet: FacetFilter) {
    this.query.setFacet(facet);
    this.service.setQuery(this.query);
  }

}
