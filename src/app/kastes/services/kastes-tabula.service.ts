import { Injectable } from '@angular/core';
import { KastesApiService } from './kastes-api.service';
import { Subject, Observable, MonoTypeOperatorFunction, ReplaySubject, BehaviorSubject, combineLatest, pipe, merge, EMPTY, of } from 'rxjs';
import { Kaste, Totals, RowUpdate, Colors } from 'src/app/interfaces';
import { switchMap, share, pluck, shareReplay, withLatestFrom, map, tap, startWith, throttleTime, mergeMap, filter } from 'rxjs/operators';
import { KastesPreferencesService } from './kastes-preferences.service';
import { cacheWithUpdate } from 'src/app/library/rx';

@Injectable()
export class KastesTabulaService {

  constructor(
    private kastesApi: KastesApiService,
    private prefService: KastesPreferencesService,
  ) { }

  pasutijumsId$ = this.prefService.preferences$.pipe(
    pluck('pasutijums'),
  );
  apjoms$ = new BehaviorSubject(0);

  reloadKastes$ = new Subject<void>();
  updateKaste$ = new Subject<Kaste>();
  kastesGatavsUpdate$ = new Subject<RowUpdate>();
  kastesLabelUpdate$ = new Subject<number>();

  kastesLabelUpdateResult$ = new Subject<Partial<Kaste> | undefined>();

  apjomi$: Observable<number[]> = this.pasutijumsId$.pipe(
    switchMap(pasutijumsId => this.kastesApi.kastes.getApjomi({ pasutijumsId }).pipe()
    ),
  );

  kastesAll$: Observable<Kaste[]> = this.reloadKastes$.pipe(
    startWith({}),
    // throttleTime(3000),
    switchMap(() => this.pasutijumsId$),
    switchMap(pasutijumsId => this.kastesApi.kastes.get<Kaste>({ pasutijumsId })),
    cacheWithUpdate(this.updateKaste$, (o1, o2) => o1._id === o2._id && o1.kaste === o2.kaste),
  );

  kastesApjoms$: Observable<Kaste[]> = combineLatest([
    this.kastesAll$,
    this.apjoms$,
  ]).pipe(
    map(([kastes, apj]) => kastes.filter(k => !apj || k.kastes.total === apj)),
    shareReplay(1),
  );

  readonly totals$ = this.kastesApjoms$.pipe(
    map(calcTotals),
  );

  setGatavs(kaste: Kaste, yesno: boolean): Observable<boolean> {
    return this.kastesApi.kastes.setGatavs(kaste, yesno).pipe(
      mergeMap(() => this.kastesApi.kastes.get(kaste._id, { kaste: kaste.kaste }).pipe(
        tap(k => this.updateKaste$.next(k)),
      )),
      map(resp => !!resp),
    );
  }

  setLabel(kods: number | string): Observable<Kaste | undefined> {
    return this.pasutijumsId$.pipe(
      mergeMap(pasutijumsId => this.kastesApi.kastes.setLabel(pasutijumsId, kods)),
      mergeMap(
        resp => resp ? this.kastesApi.kastes.get(resp._id, { kaste: resp.kaste }).pipe(
          tap(k => this.updateKaste$.next(k)),
        ) : of(undefined)
      ),
    );
  }

}

function calcTotals(kastes: Kaste[]): Totals {
  const colorsPakas =
    kastes.reduce((total, curr) => {
      const _ = curr.kastes.gatavs || Object.keys(total).forEach(key => total[key] += curr.kastes[key]);
      return total;
    }, { yellow: 0, rose: 0, white: 0 });
  return {
    total: kastes.length,
    kastesRemain: kastes.reduce((total, curr) => total += curr.kastes.gatavs ? 0 : 1, 0),
    labelsRemain: kastes.reduce((total, curr) => total += curr.kastes.uzlime ? 0 : 1, 0),
    colorTotals: Object.keys(colorsPakas).map((k: Colors) => ({
      color: k,
      total: colorsPakas[k],
    }))
  };
}
