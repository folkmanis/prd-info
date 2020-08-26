import { Injectable } from '@angular/core';
import { Observable, Subject, EMPTY } from 'rxjs';
import { tap, map, switchMap, filter, shareReplay, startWith } from 'rxjs/operators';
import { KastesOrder, CleanupResponse, KastesOrderPartial } from 'src/app/interfaces';
import { KastesPreferencesService } from './kastes-preferences.service';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';

@Injectable()
export class PasutijumiService {
  private _pasutijumi$: Observable<KastesOrderPartial[]>;
  reload$: Subject<void> = new Subject();

  constructor(
    private kastesPreferencesService: KastesPreferencesService,
    private prdApi: PrdApiService,
  ) { }

  get pasutijumi$(): Observable<KastesOrderPartial[]> {
    if (!this._pasutijumi$) {
      this._pasutijumi$ = this.reload$.pipe(
        startWith({}),
        switchMap(() => this.prdApi.kastesOrders.get<KastesOrder>()),
        shareReplay(1),
      );
    }
    return this._pasutijumi$;
  }

  getPasutijums(id: string): Observable<KastesOrder> {
    return this.prdApi.kastesOrders.get(id);
  }

  setPasutijums(id: string): Observable<boolean> {
    return this.kastesPreferencesService.updateUserPreferences({ pasutijums: id });
  }

  addPasutijums(name: string): Observable<string> {
    return this.prdApi.kastesOrders.insertOne({ name }).pipe(
      map((id: string) => id),
      tap(() => this.reload$.next()),
    );
  }

  updatePasutijums(pas: Partial<KastesOrder>): Observable<boolean> {
    if (!pas._id || !pas._id.length) {
      return EMPTY;
    }
    return this.prdApi.kastesOrders.updateOne(pas._id, pas).pipe(
      tap(upd => upd && this.reload$.next()),
    );
  }

  cleanup(): Observable<CleanupResponse> {
    return this.prdApi.kastesOrders.deleteInactive().pipe(
      tap(resp => (resp.orders || resp.veikali) && this.reload$.next())
    );
  }

}
