import { Injectable } from '@angular/core';
import { Observable, Subject, EMPTY } from 'rxjs';
import { tap, map, switchMap, filter, shareReplay, startWith } from 'rxjs/operators';
import { Pasutijums, CleanupResponse } from '../interfaces';
import { KastesPreferencesService } from './kastes-preferences.service';
import { KastesApiService, KastesApi } from './kastes-api.service';

@Injectable()
export class PasutijumiService {
  private _pasutijumi$: Observable<Pasutijums[]>;
  reload$: Subject<void> = new Subject();

  constructor(
    private kastesPreferencesService: KastesPreferencesService,
    private kastesApi: KastesApiService,
  ) { }

  get pasutijumi$(): Observable<Pasutijums[]> {
    if (!this._pasutijumi$) {
      this._pasutijumi$ = this.reload$.pipe(
        startWith({}),
        switchMap(() => this.kastesApi.orders.get<Pasutijums>()),
        shareReplay(1),
      );
    }
    return this._pasutijumi$;
  }

  setPasutijums(id: string): Observable<boolean> {
    return this.kastesPreferencesService.updateUserPreferences({ pasutijums: id });
  }

  addPasutijums(name: string): Observable<string> {
    return this.kastesApi.orders.insertOne({ name }).pipe(
      map((id: string) => id),
      tap(() => this.reload$.next()),
    );
  }

  updatePasutijums(pas: Partial<Pasutijums>): Observable<boolean> {
    if (!pas._id || !pas._id.length) {
      return EMPTY;
    }
    return this.kastesApi.orders.updateOne(pas._id, pas).pipe(
      tap(upd => upd && this.reload$.next()),
    );
  }

  cleanup(): Observable<CleanupResponse> {
    return this.kastesApi.orders.deleteInactive().pipe(
      tap(resp => (resp.orders || resp.veikali) && this.reload$.next())
    );
  }

}
