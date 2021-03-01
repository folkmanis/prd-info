import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { map, mergeMap, pluck, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
import { Colors, Kaste, Totals, COLORS } from 'src/app/interfaces';
import { cacheWithUpdate } from 'prd-cdk';
import { PrdApiService } from 'src/app/services';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';

@Injectable()
export class KastesTabulaService {

  constructor(
    private prdApi: PrdApiService,
    private prefService: KastesPreferencesService,
  ) { }

  private _pasutijumsId$ = this.prefService.pasutijumsId$;

  private readonly _apjoms$ = new BehaviorSubject(0);
  private readonly _reloadKastes$ = new Subject<void>();
  private readonly _updateKaste$ = new Subject<Kaste>();

  apjoms$ = this._apjoms$.asObservable();
  apjomi$: Observable<number[]> = this._pasutijumsId$.pipe(
    switchMap(pasutijumsId => this.prdApi.kastes.getApjomi({ pasutijumsId })),
  );

  kastesAll$: Observable<Kaste[]> = this._reloadKastes$.pipe(
    startWith({}),
    switchMap(() => this._pasutijumsId$),
    switchMap(pasutijumsId => this.prdApi.kastes.get<Kaste>({ pasutijumsId })),
    cacheWithUpdate(this._updateKaste$, (o1, o2) => o1._id === o2._id && o1.kaste === o2.kaste),
  );

  kastesApjoms$: Observable<Kaste[]> = combineLatest([
    this.kastesAll$,
    this._apjoms$,
  ]).pipe(
    map(([kastes, apj]) => kastes.filter(k => !apj || k.kastes.total === apj)),
    shareReplay(1),
  );

  readonly totals$ = this.kastesApjoms$.pipe(
    map(calcTotals),
  );

  setApjoms(apjoms: number) {
    this._apjoms$.next(apjoms);
  }

  reload() {
    this._reloadKastes$.next();
  }

  setGatavs(kaste: Kaste, yesno: boolean): Observable<boolean> {
    return this.prdApi.kastes.setGatavs(kaste, yesno).pipe(
      mergeMap(() => this.prdApi.kastes.get(kaste._id, { kaste: kaste.kaste }).pipe(
        tap(k => this._updateKaste$.next(k)),
      )),
      map(resp => !!resp),
    );
  }

  setLabel(kods: number | string): Observable<Kaste | null> {
    return this._pasutijumsId$.pipe(
      take(1),
      mergeMap(pasutijumsId => this.prdApi.kastes.setLabel(pasutijumsId, kods)),
      mergeMap(
        resp => resp ? this.prdApi.kastes.get(resp._id, { kaste: resp.kaste }).pipe(
          tap(k => this._updateKaste$.next(k)),
        ) : of(null)
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
    kastes: kastes.reduce((total, curr) => total += curr.kastes.gatavs ? 0 : 1, 0),
    labels: kastes.reduce((total, curr) => total += curr.kastes.uzlime ? 0 : 1, 0),
    colorTotals: COLORS.map((k: Colors) => ({
      color: k,
      total: colorsPakas[k],
    }))
  };
}
