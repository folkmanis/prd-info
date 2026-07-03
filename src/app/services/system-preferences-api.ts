import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { SystemPreferences, SystemPreferencesSchema } from 'src/app/interfaces';
import { HttpOptions, httpResponseRequest } from 'src/app/library/http';
import { ValidatorService } from '../library';

@Service()
export class SystemPreferencesApiService {
  readonly #path = getAppParams('apiPath') + 'preferences/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);
  #defaultPreferences: SystemPreferences = getAppParams('defaultSystemPreferences');

  getPreferencesResource(isLoggedIn: Signal<boolean>): HttpResourceRef<SystemPreferences> {
    return httpResource(() => (isLoggedIn() ? httpResponseRequest(this.#path) : undefined), {
      parse: this.#validator.validatorFn(SystemPreferencesSchema),
      defaultValue: this.#defaultPreferences,
    });
  }

  updateMany(data: SystemPreferences): Observable<SystemPreferences> {
    return this.#http
      .patch(this.#path, data, new HttpOptions())
      .pipe(map(this.#validator.validatorFn(SystemPreferencesSchema)));
  }
}
