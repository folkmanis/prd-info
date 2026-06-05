import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { debounceTime, tap } from 'rxjs';
import { DrawerButtonDirective } from '../library/side-button/drawer-button.directive';
import { DrawerSmallDirective } from '../library/view-size/drawer-small.directive';
import { FacetComponent } from './facet/facet.component';
import { FacetFilter, SearchFilter } from './interfaces';
import { SearchInputComponent } from './search-input/search-input.component';
import { SearchTableComponent } from './search-table/search-table.component';
import { ArchiveSearchService } from './services/archive-search.service';
import { StatusCountComponent } from './status-count/status-count.component';

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
  protected facetComponent = viewChild.required(FacetComponent);

  #service = inject(ArchiveSearchService);

  #filter = signal<SearchFilter>({ search: '', facet: {} });

  protected searchString = computed(() => this.#filter().search);

  protected busy = signal(true);

  private filter$ = toObservable(this.#filter).pipe(debounceTime(300));

  protected count$ = this.#service.getCount(this.filter$);

  protected facet$ = this.#service.getFacet(this.filter$);

  protected data$ = this.#service.getData(this.filter$, this.count$).pipe(tap(() => this.busy.set(false)));

  protected onSearchString(str: string) {
    this.busy.set(true);
    this.#filter.set({ search: str, facet: {} });
    this.facetComponent().deselectAll();
  }

  protected onFacet(facetUpdate: FacetFilter) {
    this.busy.set(true);
    this.#filter.update(({ search }) => ({ search, facet: facetUpdate }));
  }
}
