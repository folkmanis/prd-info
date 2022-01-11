import { Injectable } from '@angular/core';
import { ClassTransformer } from 'class-transformer';
import { OperatorFunction, pipe } from 'rxjs';
import { concatMap, map, withLatestFrom } from 'rxjs/operators';
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
      withLatestFrom(this.prefService.userPreferences$),
      map(([update, pref]) => (
        {
          ...pref,
          jobsProductionQuery: {
            ...pref.jobsProductionQuery,
            ...update,
          }
        }
      )),
      map(update => this.transformer.plainToInstance(JobsUserPreferences, update)),
      concatMap(pref => this.prefService.setUserPreferences(pref)),
    );

  }



}
