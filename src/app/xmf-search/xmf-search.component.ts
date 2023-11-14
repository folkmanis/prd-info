import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FacetComponent } from './facet/facet.component';
import { FacetFilter, SearchQuery } from './interfaces';
import { ArchiveSearchService } from './services/archive-search.service';
import { AsyncPipe } from '@angular/common';
import { SearchTableComponent } from './search-table/search-table.component';
import { StatusCountComponent } from './status-count/status-count.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { DrawerButtonDirective } from '../library/side-button/drawer-button.directive';
import { DrawerSmallDirective } from '../library/view-size/drawer-small.directive';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
    selector: 'app-xmf-search',
    templateUrl: './xmf-search.component.html',
    styleUrls: ['./xmf-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        DrawerSmallDirective,
        DrawerButtonDirective,
        FacetComponent,
        SearchInputComponent,
        StatusCountComponent,
        SearchTableComponent,
        AsyncPipe,
    ],
})
export class XmfSearchComponent {
  @ViewChild(FacetComponent) private facetComponent: FacetComponent;

  readonly query$ = new BehaviorSubject<SearchQuery>(new SearchQuery());

  count$ = this.service.getCount(this.query$);
  facet$ = this.service.getFacet(this.query$);

  data$ = this.service.getData(this.query$, this.count$);

  constructor(private service: ArchiveSearchService) {}

  onSearch(search: string) {
    this.facetComponent.onDeselectAll();
    this.query$.next(new SearchQuery(search));
  }

  onFacet(facet: FacetFilter) {
    this.query$.next(this.query$.value.setFacet(facet));
  }
}
