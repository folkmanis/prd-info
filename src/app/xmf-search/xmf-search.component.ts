import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DrawerButtonDirective } from '../library/side-button/drawer-button.directive';
import { DrawerSmallDirective } from '../library/view-size/drawer-small.directive';
import { FacetComponent } from './facet/facet.component';
import { ArchiveFacet, FacetFilter, SearchQuery } from './interfaces';
import { SearchInputComponent } from './search-input/search-input.component';
import { SearchTableComponent } from './search-table/search-table.component';
import { ArchiveSearchService } from './services/archive-search.service';
import { StatusCountComponent } from './status-count/status-count.component';

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
  private facetComponent = viewChild.required(FacetComponent);

  private service = inject(ArchiveSearchService);

  query = signal(new SearchQuery());

  private query$ = toObservable(this.query);

  count$ = this.service.getCount(this.query$);

  facet = toSignal(
    this.service.getFacet(this.query$),
    { initialValue: new ArchiveFacet() }
  );

  data$ = this.service.getData(this.query$, this.count$);

  onSearch(search: string) {
    this.facetComponent().deselectAll();
    this.query.set(new SearchQuery(search));
  }

  onFacet(facet: FacetFilter) {
    const query = this.query();
    this.query.set(query.setFacet(facet));
  }
}
