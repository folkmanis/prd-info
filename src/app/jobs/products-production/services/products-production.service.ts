import { Injectable, computed, inject, signal } from '@angular/core';
import { JobsProductionFilterQuery, JobsProductionQuery } from '../../interfaces';
import { SavedJobsProductionQuery } from '../../interfaces/jobs-user-preferences';
import { JobsUserPreferencesService } from '../../services/jobs-user-preferences.service';
import { combineReload } from 'src/app/library/rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { NotificationsService } from 'src/app/services';
import { JobsApiService } from '../../services/jobs-api.service';
import { debounceTime, filter, map, switchMap } from 'rxjs';
import { isEqual, pickBy } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class ProductsProductionService {

  private preferencesService = inject(JobsUserPreferencesService);
  private notifications = inject(NotificationsService);
  private api = inject(JobsApiService);

  private start = signal(0);

  private limit = signal(1000);

  query = computed(() => {
    const userPreferences = this.preferencesService.userPreferences();
    if (userPreferences) {
      const query = pickBy(userPreferences.jobsProductionQuery);
      return {
        ...query,
        start: this.start(),
        limit: this.limit(),
      } as JobsProductionQuery;
    } else {
      return null;
    }
  });

  dataFlow() {
    const wsUpdates$ = this.notifications.wsMultiplex('jobs')
      .pipe(map(() => undefined));
    return combineReload(
      toObservable(this.query),
      wsUpdates$,
    ).pipe(
      filter(Boolean),
      debounceTime(300),
      switchMap((query) => this.api.getJobsProduction(query)),
    );
  }

  async setFilter(filter: JobsProductionFilterQuery) {
    const userPreferences = this.preferencesService.userPreferences();
    if (userPreferences) {
      const jobsProductionQuery: SavedJobsProductionQuery = {
        sort: userPreferences.jobsProductionQuery.sort,
        ...filter,
      };
      return this.preferencesService.patchUserPreferences({ jobsProductionQuery });

    }
  }

  async setSort(sort: string) {
    const userPreferences = this.preferencesService.userPreferences();
    if (userPreferences) {
      const jobsProductionQuery: SavedJobsProductionQuery = {
        ...userPreferences.jobsProductionQuery,
        sort,
      };
      return this.preferencesService.patchUserPreferences({ jobsProductionQuery });
    }
  }

}
