import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { KastesJob, KastesJobPartial, Veikals } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';

@Injectable({
  providedIn: 'any',
})
export class PasutijumiService {
  reload$: Subject<void> = new Subject();

  constructor(
    private prdApi: PrdApiService,
  ) { }

  getKastesJobs(options: { veikali: boolean; }): Observable<KastesJobPartial[]> {
    return this.prdApi.kastesOrders.get({
      ...options,
      veikali: options.veikali ? 1 : 0,
    });
  }

  getOrder(id: number): Observable<KastesJob> {
    return this.prdApi.kastesOrders.get(id);
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
    return this.prdApi.kastes.deleteVeikali(pasutijumsId);
  }

  parseXlsx(file: File | undefined): Observable<(string | number)[][]> {
    if (!file) {
      return of([]);
    }
    const form = new FormData;
    form.append('table', file, file.name);
    return this.prdApi.kastes.parseXlsx(form).pipe(
      map(data => normalizeTable(data))
    );
  }

}


function normalizeTable(data: any[][]): Array<string | number>[] {
  const width = data.reduce((acc, row) => row.length > acc ? row.length : acc, 0);
  const ndata = data.map(row => {
    const nrow = new Array(width);
    for (let idx = 0; idx < width; idx++) {
      nrow[idx] = row[idx] || '';
    }
    return nrow;
  });
  return ndata;
}

