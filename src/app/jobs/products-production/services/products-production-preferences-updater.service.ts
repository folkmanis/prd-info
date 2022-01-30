import { Injectable } from '@angular/core';
import { ClassTransformer } from 'class-transformer';
import { OperatorFunction, pipe } from 'rxjs';
import { bufferTime, concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { JobsUserPreferences, SavedJobsProductionQuery } from '../../interfaces/jobs-user-preferences';
import { JobsUserPreferencesService } from '../../services/jobs-user-preferences.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsProductionPreferencesUpdaterService {

  constructor(
    private transformer: ClassTransformer,
    private prefService: JobsUserPreferencesService,
  ) { }

  savePreferences(): OperatorFunction<Partial<SavedJobsProductionQuery>, any> {

    return pipe(
      bufferTime(1000),
      filter(buffer => buffer.length > 0),
      withLatestFrom(this.prefService.userPreferences$),
      map(([updates, pref]) => this.applyPreferences(pref, updates)),
      map(update => this.transformer.plainToInstance(JobsUserPreferences, update)),
      concatMap(pref => this.prefService.setUserPreferences(pref)),
    );

  }

  private applyPreferences(preferences: JobsUserPreferences, updates: Partial<SavedJobsProductionQuery>[]): JobsUserPreferences {
    const jobsProductionQuery = this.reduceUpdates(preferences.jobsProductionQuery, updates);
    return {
      ...preferences,
      jobsProductionQuery,
    };
  }

  private reduceUpdates(savedQuery: SavedJobsProductionQuery, updates: Partial<SavedJobsProductionQuery>[]): SavedJobsProductionQuery {
    return updates.reduce((acc, update) => ({ ...acc, ...update }), savedQuery);
  }

}
