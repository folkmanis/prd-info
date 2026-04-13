import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { filter, map, Subject } from 'rxjs';
import { combineReload } from 'src/app/library/rxjs';
import { DrawerButtonDirective } from 'src/app/library/side-button/drawer-button.directive';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { CustomersService, NotificationsService, ProductsService } from 'src/app/services';
import { JobFilter } from '../interfaces';
import { JobListService } from '../services/job-list.service';
import { JobsUserPreferencesService } from '../services/jobs-user-preferences.service';
import { JobListFilterComponent } from './job-list-filter/job-list-filter.component';
import { JobListTableComponent } from './job-list-table/job-list-table.component';

@Component({
  selector: 'app-job-list',
  imports: [MatSidenavModule, DrawerButtonDirective, AsyncPipe, JobListTableComponent, JobListFilterComponent],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ViewSizeDirective],
})
export class JobListComponent {
  #jobListService = inject(JobListService);
  #userPreferencesService = inject(JobsUserPreferencesService);

  #notifications$ = inject(NotificationsService)
    .wsMultiplex('jobs')
    .pipe(map(() => undefined));
  #reload$ = new Subject<void>();

  protected filter$ = toObservable(this.#userPreferencesService.userPreferences).pipe(
    filter(Boolean),
    map((p) => p.jobListFilter),
  );
  protected data$ = this.#jobListService.getUnwindedData(
    combineReload(this.filter$, this.#notifications$, this.#reload$),
  );

  protected activeProducts$ = inject(ProductsService).getProducts({ disabled: false });
  protected customers$ = inject(CustomersService).getCustomerList({ disabled: false });

  highlited: string | null = null;

  onJobFilter(filter: JobFilter) {
    this.#userPreferencesService.patchUserPreferences({ jobListFilter: filter });
  }
}
