import { ViewChild, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from 'src/app/services';
import { ArchiveSearchService } from './services/archive-search.service';
import { FacetFilter, SearchQuery } from './interfaces';
import { FacetComponent } from './facet/facet.component';

@Component({
  selector: 'app-xmf-search',
  templateUrl: './xmf-search.component.html',
  styleUrls: ['./xmf-search.component.scss'],
  providers: [ArchiveSearchService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmfSearchComponent implements OnInit {

  @ViewChild(FacetComponent) facetComponent: FacetComponent;

  isSmall$: Observable<boolean> = this.layoutService.isSmall$;
  count$ = this.service.count$;
  facet$ = this.service.facet$;

  query: SearchQuery;

  constructor(
    private service: ArchiveSearchService,
    private layoutService: LayoutService,
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
