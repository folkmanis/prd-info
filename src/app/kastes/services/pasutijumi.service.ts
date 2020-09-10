import { Injectable } from '@angular/core';
import { Observable, Subject, EMPTY, of } from 'rxjs';
import { tap, map, switchMap, filter, shareReplay, startWith, take } from 'rxjs/operators';
import { KastesJobPartial, KastesJob } from 'src/app/interfaces';
import { KastesPreferencesService } from './kastes-preferences.service';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable()
export class PasutijumiService {
  private _pasutijumi$: Observable<KastesJobPartial[]>;
  reload$: Subject<void> = new Subject();

  constructor(
    private kastesPreferencesService: KastesPreferencesService,
    private prdApi: PrdApiService,
  ) { }

  get pasutijumi$(): Observable<KastesJobPartial[]> {
    if (!this._pasutijumi$) {
      this._pasutijumi$ = this.reload$.pipe(
        startWith({}),
        switchMap(() => this.prdApi.kastesOrders.get<KastesJob>()),
        shareReplay(1),
      );
    }
    return this._pasutijumi$;
  }

  getOrder(id: number): Observable<KastesJob> {
    return this.prdApi.kastesOrders.get(id);
  }

  setActiveOrder(id: number): Observable<boolean> {
    return this.kastesPreferencesService.updateUserPreferences({ pasutijums: id });
  }

  addOrder(nameOrOrder: string | Partial<KastesJob>): Observable<string> {
    const order = typeof nameOrOrder === 'string' ? { name: nameOrOrder } : nameOrOrder;
    return this.prdApi.kastesOrders.insertOne(order).pipe(
      map((id: string) => id),
      tap(() => this.reload$.next()),
    );
  }

  updateOrder(pas: Partial<KastesJob>): Observable<boolean> {
    if (!pas._id || !pas._id.length) {
      return EMPTY;
    }
    return this.prdApi.kastesOrders.updateOne(pas._id, pas).pipe(
      tap(upd => upd && this.reload$.next()),
    );
  }

  cleanup(): Observable<number> {
    return this.prdApi.kastesOrders.deleteInactive().pipe(
      tap(resp => resp && this.reload$.next())
    );
  }

  existPasutijumsValidatorFn(): AsyncValidatorFn {
    let initial: any;
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (initial === undefined) { initial = control.value; }
      if (control.value === initial) { return of(null); }
      return this.pasutijumi$.pipe(
        take(1),
        map((pas) =>
          pas.find((el) => el.name === control.value) ? { existPasutijumsName: { value: control.value } } : null
        ),
      );
    };
  }


}
