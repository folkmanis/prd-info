import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppParams } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';
import { ApiBase, HttpOptions } from 'src/app/library';

import { Kaste, KasteResponse, KastesUserPreferences } from '../interfaces';
import { map, mapTo } from 'rxjs/operators';

@Injectable()
export class KastesApiService {

  constructor(
    private http: HttpClient,
    @Inject(APP_PARAMS) private params: AppParams,
  ) { }

  private readonly apiPath = this.params.apiPath;

  kastes = new KastesApi(this.http, this.apiPath + 'kastes/');

}

export class KastesApi extends ApiBase<Kaste> {

  getApjomi(options: { pasutijumsId: string; }): Observable<number[]> {
    return this.http.get<KasteResponse>(this.path + 'apjomi', new HttpOptions(options)).pipe(
      map(resp => resp.apjomi),
    );
  }

  getUserPreferences(): Observable<KastesUserPreferences> {
    return this.http.get<KasteResponse>(this.path + 'preferences', new HttpOptions()).pipe(
      map(resp => resp.userPreferences),
    );
  }

  setUserPreferences(prefs: Partial<KastesUserPreferences>): Observable<boolean> {
    return this.http.post(this.path + 'preferences', prefs, new HttpOptions()).pipe(
      mapTo(true),
    );
  }

  setGatavs(kaste: Pick<Kaste, '_id' | 'kaste'>, yesno: boolean): Observable<number> {
    return this.http.post<KasteResponse>(
      `${this.path}${kaste._id}/${kaste.kaste}/gatavs/${yesno ? 1 : 0}`,
      {},
      new HttpOptions())
      .pipe(
        map(resp => resp.modifiedCount)
      );
  }

  setLabel(pasutijumsId: string, kods: number | string): Observable<Kaste | undefined> {
    return this.http.post<KasteResponse>(
      this.path + 'label',
      { kods },
      new HttpOptions({ pasutijumsId })
    )
      .pipe(
        map(resp => resp.data as Kaste | undefined)
      );
  }
}
