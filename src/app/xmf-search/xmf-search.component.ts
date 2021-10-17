import { ViewChild, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from 'src/app/services';
import { ArchiveSearchService } from './services/archive-search.service';
import { FacetFilter, SearchQuery } from 'src/app/interfaces/xmf-search';
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

  constructor(
    private service: ArchiveSearchService,
    private layoutService: LayoutService,
  ) { }

  isSmall$: Observable<boolean> = this.layoutService.isSmall$;

  count$ = this.service.count$;

  facet$ = this.service.facet$;

  query: SearchQuery = { q: '' };

  ngOnInit() {
  }

  onSearch(search: string) {
    this.query = {
      q: search
    };
    this.facetComponent.onDeselectAll();
    this.service.setQuery(this.query);
  }

  onFacet(facet: FacetFilter) {
    this.query = {
      q: this.query.q,
      ...facet,
    };
    this.service.setQuery(this.query);
  }

}
