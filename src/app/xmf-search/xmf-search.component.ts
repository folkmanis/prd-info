import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from 'src/app/layout/layout.service';
import { ArchiveSearchService } from './services/archive-search.service';
import { FacetFilter } from 'src/app/interfaces/xmf-search';

@Component({
  selector: 'app-xmf-search',
  templateUrl: './xmf-search.component.html',
  styleUrls: ['./xmf-search.component.css'],
  providers: [ArchiveSearchService],
})
export class XmfSearchComponent implements OnInit {

  constructor(
    private service: ArchiveSearchService,
    private layoutService: LayoutService,
  ) { }

  isSmall$: Observable<boolean> = this.layoutService.isSmall$;

  count$ = this.service.count$;

  facet$ = this.service.facetResult$;

  ngOnInit() {
  }

  onSearch(search: string) {
    this.service.setSearch(search);
  }

  onFacet(f: Partial<FacetFilter>) {
    this.service.setFacetFilter(f);
  }

}
