import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { PreferencesDbModules } from 'src/app/interfaces';
import { HttpOptions } from 'src/app/library/http';

@Injectable({
  providedIn: 'root',
})
export class SystemPreferencesApiService {
  readonly #path = getAppParams('apiPath') + 'preferences/';
  #http = inject(HttpClient);

  async getAll(): Promise<PreferencesDbModules[]> {
    const data = await firstValueFrom(this.#http.get<Record<string, any>[]>(this.#path, new HttpOptions().cacheable()));
    return data.map((item) => PreferencesDbModules.parse(item));
  }

  updateMany(data: Partial<PreferencesDbModules>[]): Observable<number> {
    return this.#http.patch<number>(this.#path, data, new HttpOptions());
  }
}
