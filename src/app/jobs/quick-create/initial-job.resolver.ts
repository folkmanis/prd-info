import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { JobsUserPreferencesService } from '../services/jobs-user-preferences.service';
import { resolveCatching } from 'src/app/library/guards';
import { QuickCreateJob } from '../interfaces/jobs-user-preferences';

export const initialJobResolver: ResolveFn<QuickCreateJob> = (_, state) => {
  return resolveCatching(state.url, async () => {
    const preferences = await inject(JobsUserPreferencesService).getUserPreferences();
    return preferences.quickCreateJob;
  });
};
