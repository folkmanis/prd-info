import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_JOBS_USER_PREFERENCES, JobsUserPreferences } from '../interfaces/jobs-user-preferences';
import { JobsApiService } from './jobs-api.service';
import { notNullOrThrow } from 'src/app/library';

@Injectable({
  providedIn: 'root',
})
export class JobsUserPreferencesService {
  private api = inject(JobsApiService);

  userPreferences = signal<JobsUserPreferences | null>(null, { equal: isEqual });

  constructor() {
    this.getUserPreferences().then((preferences) => this.userPreferences.set(preferences));
  }

  patchUserPreferences(patch: Partial<JobsUserPreferences>) {
    const update = {
      ...notNullOrThrow(this.userPreferences()),
      ...patch,
    };
    return this.setUserPreferences(update);
  }

  async setUserPreferences(preferences: JobsUserPreferences): Promise<JobsUserPreferences> {
    this.userPreferences.set(preferences);
    const updatedPreferences = await firstValueFrom(this.api.setUserPreferences(preferences));
    this.userPreferences.set(updatedPreferences);
    return updatedPreferences;
  }

  private async getUserPreferences(): Promise<JobsUserPreferences> {
    try {
      return firstValueFrom(this.api.getUserPreferences());
    } catch (error) {
      return this.setMissingPreferences(error);
    }
  }

  private setMissingPreferences(error: Error): Promise<JobsUserPreferences> {
    if (error instanceof HttpErrorResponse && error.status === 404) {
      return this.setUserPreferences(DEFAULT_JOBS_USER_PREFERENCES);
    }
    throw error;
  }
}
