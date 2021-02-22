import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { KastesJob, KastesJobPartial, Veikals } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { KastesPreferencesService } from './kastes-preferences.service';

@Injectable({
  providedIn: 'any',
})
export class PasutijumiService {
  reload$: Subject<void> = new Subject();

  constructor(
    private prdApi: PrdApiService,
  ) { }

  getKastesJobs(options: { veikali: boolean }): Observable<KastesJobPartial[]> {
    return this.prdApi.kastesOrders.get({
      ...options,
      veikali: options.veikali ? 1 : 0,
    });
  }

  getOrder(id: number): Observable<KastesJob> {
    return this.prdApi.kastesOrders.get(id);
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

  updateOrderVeikali(veikali: Veikals[]): Observable<number> {
    return this.prdApi.kastes.updateVeikali(veikali);
  }

  addKastes(orderId: number, data: Veikals[]): Observable<number> {
    return this.prdApi.kastes.putTable({
      orderId,
      data,
    });
  }

  deleteKastes(pasutijumsId: number): Observable<number> {
    return this.prdApi.kastes.deleteVeikali({ pasutijumsId });
  }

}
