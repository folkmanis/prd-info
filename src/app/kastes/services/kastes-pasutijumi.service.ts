import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, throttleTime } from 'rxjs/operators';
import { KastesJob, Veikals, VeikalsUpload } from '../interfaces';
import { KastesJobPartial } from '../interfaces/kastes-job-partial';
import { KastesApiService } from './kastes-api.service';
import { KastesOrdersApiService } from './kastes-orders-api.service';

export interface KastesJobFilter {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class KastesPasutijumiService {

  private readonly _filter$ = new BehaviorSubject<KastesJobFilter>({});

  kastesJobs$: Observable<KastesJobPartial[]> = this._filter$.pipe(
    throttleTime(300),
    switchMap(filter => this.getKastesJobs(filter))
  );

  constructor(
    private api: KastesApiService,
    private ordersApi: KastesOrdersApiService,
  ) { }

  setFilter(filter: KastesJobFilter) {
    this._filter$.next(filter);
  }

  getKastesJobs(filter: KastesJobFilter): Observable<KastesJobPartial[]> {
    return this.ordersApi.getAll(filter);
  }

  getKastesJob(id: number): Observable<KastesJob> {
    return this.ordersApi.getOne(id);
  }

  getVeikali(jobId: number): Observable<Veikals[]> {
    return this.api.getVeikali(jobId);
  }

  updateOrderVeikals(veikals: Veikals): Observable<Veikals> {
    return this.api.updateVeikals(veikals);
  }

  addKastes(data: VeikalsUpload[]): Observable<number> {
    return this.api.putTable(data);
  }

  deleteKastes(pasutijumsId: number): Observable<number> {
    return this.api.deleteVeikali(pasutijumsId);
  }

  parseXlsx(file: File | undefined): Observable<(string | number)[][]> {
    if (!file) {
      return of([]);
    }
    const form = new FormData;
    form.append('table', file, file.name);
    return this.api.parseXlsx(form).pipe(
      map(data => this.normalizeTable(data))
    );
  }

  private normalizeTable(data: any[][]): Array<string | number>[] {
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

}


