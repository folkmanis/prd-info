import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { KastesJob, Veikals, VeikalsUpload } from '../interfaces';
import { KastesJobPartial } from '../interfaces/kastes-job-partial';
import { KastesApiService } from './kastes-api.service';

export interface KastesJobFilter {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class KastesPasutijumiService {
  private api = inject(KastesApiService);

  getKastesJobs(filter: KastesJobFilter = {}): Observable<KastesJobPartial[]> {
    return this.api.getAllKastesJobs(filter);
  }

  async getKastesJob(id: number): Promise<KastesJob> {
    return firstValueFrom(this.api.getOneKastesJob(id));
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

  async deleteKastes(pasutijumsId: number): Promise<number> {
    return firstValueFrom(this.api.deleteVeikali(pasutijumsId));
  }

  copyToFirestore(pasutijumsId: number) {
    return this.api.postFirestoreUpload(pasutijumsId);
  }

  copyFromFirestore(pasutijumsId: number) {
    return this.api.postFirestoreDownload(pasutijumsId);
  }

  parseXlsx(file: File | undefined): Observable<(string | number)[][]> {
    if (!file) {
      return of([]);
    }
    const form = new FormData();
    form.append('table', file, file.name);
    return this.api.parseXlsx(form).pipe(map((data) => this.normalizeTable(data)));
  }

  private normalizeTable(data: any[][]): Array<string | number>[] {
    const width = data.reduce((acc, row) => (row.length > acc ? row.length : acc), 0);
    return data
      .filter((row) => row.length > 0)
      .map((row) => {
        const nrow = new Array(width);
        for (let idx = 0; idx < width; idx++) {
          nrow[idx] = row[idx] || '';
        }
        return nrow;
      });
  }
}
