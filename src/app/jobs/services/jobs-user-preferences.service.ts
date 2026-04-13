import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, resource } from '@angular/core';
import { isEqual } from 'lodash-es';
import { notNullOrThrow } from 'src/app/library';
import { defaultJobsUserPreferences, JobsUserPreferences } from '../interfaces/jobs-user-preferences';
import { JobsApiService } from './jobs-api.service';

@Injectable({
  providedIn: 'root',
})
export class JobsUserPreferencesService {
  readonly #api = inject(JobsApiService);
  #preferencesResource = resource<JobsUserPreferences, void>({
    loader: () => {
      return this.#getUserPreferences();
    },
    equal: isEqual,
  });

  readonly userPreferences = this.#preferencesResource.value.asReadonly();

  patchUserPreferences(patch: Partial<JobsUserPreferences>) {
    const update = {
      ...notNullOrThrow(this.userPreferences()),
      ...patch,
    };
    return this.#setUserPreferences(update);
  }

  async #setUserPreferences(preferences: JobsUserPreferences): Promise<JobsUserPreferences> {
    this.#preferencesResource.set(preferences);
    const updatedPreferences = await this.#api.setUserPreferences(preferences);
    if (isEqual(preferences, updatedPreferences) === false) {
      this.#preferencesResource.set(updatedPreferences);
    }
    return updatedPreferences;
  }

  async #getUserPreferences(): Promise<JobsUserPreferences> {
    try {
      return await this.#api.getUserPreferences();
    } catch (error) {
      return this.#setMissingPreferences(error);
    }
  }

  #setMissingPreferences(error: unknown): Promise<JobsUserPreferences> {
    if (error instanceof HttpErrorResponse && error.status === 404) {
      return this.#setUserPreferences(defaultJobsUserPreferences());
    }
    throw error;
  }
}
