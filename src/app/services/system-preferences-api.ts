import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { SystemPreferences, SystemPreferencesSchema } from 'src/app/interfaces';
import { httpResponseRequest, validatorFn } from 'src/app/library';

@Service()
export class SystemPreferencesApiService {
  readonly #path = getAppParams('apiPath') + 'preferences/';
  #http = inject(HttpClient);
  #defaultPreferences: SystemPreferences = getAppParams('defaultSystemPreferences');

  getPreferencesResource(isLoggedIn: Signal<boolean>): HttpResourceRef<SystemPreferences> {
    return httpResource(() => (isLoggedIn() ? httpResponseRequest(this.#path) : undefined), {
      parse: validatorFn(SystemPreferencesSchema),
      defaultValue: this.#defaultPreferences,
    });
  }

  updateMany(data: SystemPreferences): Observable<SystemPreferences> {
    return this.#http.patch(this.#path, data).pipe(map(validatorFn(SystemPreferencesSchema)));
  }
}
