import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FacetComponent } from './facet/facet.component';
import { FacetFilter, SearchQuery } from './interfaces';
import { ArchiveSearchService } from './services/archive-search.service';

@Component({
  selector: 'app-xmf-search',
  templateUrl: './xmf-search.component.html',
  styleUrls: ['./xmf-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmfSearchComponent {

  @ViewChild(FacetComponent) private facetComponent: FacetComponent;

  readonly query$ = new BehaviorSubject<SearchQuery>(new SearchQuery());


  count$ = this.service.getCount(this.query$);
  facet$ = this.service.getFacet(this.query$);

  data$ = this.service.getData(this.query$, this.count$);

  constructor(
    private service: ArchiveSearchService,
  ) { }

  onSearch(search: string) {
    this.facetComponent.onDeselectAll();
    this.query$.next(new SearchQuery(search));
  }

  onFacet(facet: FacetFilter) {
    this.query$.next(this.query$.value.setFacet(facet));
  }

}
