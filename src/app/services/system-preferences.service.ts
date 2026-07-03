import { computed, inject, Service } from '@angular/core';
import { merge } from 'lodash-es';
import { firstValueFrom, retry } from 'rxjs';
import { LoginService } from 'src/app/login';
import { DeepPartial } from 'ts-essentials';
import { SystemPreferences } from '../interfaces';
import { SystemPreferencesApiService } from './system-preferences-api';

@Service()
export class SystemPreferencesService {
  #api = inject(SystemPreferencesApiService);

  #user = inject(LoginService).user;
  #loggedIn = computed(() => !!this.#user());

  #preferencesResource = this.#api.getPreferencesResource(this.#loggedIn);

  preferences = this.#preferencesResource.value.asReadonly();

  async updatePreferences(changes: DeepPartial<SystemPreferences>): Promise<void> {
    const update = merge(this.preferences(), changes);

    const update$ = this.#api.updateMany(update).pipe(retry(3));

    const preferences = await firstValueFrom(update$);
    this.#preferencesResource.set(preferences);
  }
}
