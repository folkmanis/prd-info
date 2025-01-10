import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { debounceTime, tap } from 'rxjs';
import { DrawerButtonDirective } from '../library/side-button/drawer-button.directive';
import { DrawerSmallDirective } from '../library/view-size/drawer-small.directive';
import { FacetComponent } from './facet/facet.component';
import { ArchiveFacet, FacetFilter, SearchQuery } from './interfaces';
import { SearchInputComponent } from './search-input/search-input.component';
import { SearchTableComponent } from './search-table/search-table.component';
import { ArchiveSearchService } from './services/archive-search.service';
import { StatusCountComponent } from './status-count/status-count.component';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-xmf-search',
  templateUrl: './xmf-search.component.html',
  styleUrls: ['./xmf-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    DrawerSmallDirective,
    DrawerButtonDirective,
    FacetComponent,
    SearchInputComponent,
    StatusCountComponent,
    SearchTableComponent,
    AsyncPipe,
    MatProgressBar,
  ],
})
export class XmfSearchComponent {
  private facetComponent = viewChild.required(FacetComponent);

  private service = inject(ArchiveSearchService);

  query = signal(new SearchQuery());

  busy = signal(true);

  private query$ = toObservable(this.query).pipe(debounceTime(300));

  count$ = this.service.getCount(this.query$);

  facet = toSignal(this.service.getFacet(this.query$), { initialValue: new ArchiveFacet() });

  data$ = this.service.getData(this.query$, this.count$).pipe(tap(() => this.busy.set(false)));

  onSearchString(str: string) {
    this.busy.set(true);
    this.query.set(new SearchQuery(str));
    this.facetComponent().deselectAll();
  }

  onFacet(facet: FacetFilter) {
    this.busy.set(true);
    const query = this.query();
    this.query.set(query.setFacet(facet));
  }
}
