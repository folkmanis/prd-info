import { Injectable, EventEmitter } from '@angular/core';
import { switchMap, tap, map } from 'rxjs/operators';
import { Observable, of, merge, BehaviorSubject } from 'rxjs';
import { Kaste } from '../../services/kastes.service';
import { AdresesCsv } from './adrese-csv';
import { AdreseBox, AdresesBox, AdrBoxTotals, Totals } from './adrese-box';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { PasutijumiService } from '../../services/pasutijumi.service';
import { KastesService } from '../../services/kastes.service';

import { UploadRow } from './upload-row';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  adresesCsv = new AdresesCsv();
  adresesBox: AdresesBox;
  adresesBox$: Observable<AdreseBox[]>;

  constructor(
    private kastesPreferencesService: KastesPreferencesService,
    private pasutijumiService: PasutijumiService,
    private kastesService: KastesService,
  ) { }

  get adresesCsv$(): Observable<Array<any[]>> {
    return this.adresesCsv.data;
  }

  get colNames(): string[] {
    return this.adresesCsv.colNames;
  }

  loadCsv(csv: string, delimiter: string = ',') {
    this.adresesCsv.setCsv(csv, delimiter);
  }

  get adresesBoxTotals(): AdrBoxTotals {
    return {
      adreses: this.adresesBox.data.length,
      boxes: this.adresesBox.totals.boxCount,
      apjomi: this.adresesBox.apjomi,
    };
  }

   get adresesTotals(): Totals {
    return this.adresesBox.totals;
  }
  /**
   * Izdzēš slejas, kuras norādītas masīvā
   * @param colMap Dzēšamās slejas norādītas ar true
   */
  deleteAdresesCsvColumns(colMap: []) {
    this.adresesCsv.deleteColumns(colMap);
  }

  joinAdresesCsvColumns(colMap: []) {
    this.adresesCsv.joinColumns(colMap)
  }

  deleteCsvRows(selected: any[]) {
    this.adresesCsv.deleteRows(selected);
  }

  adresesToKastes(colMap: Map<number, string>, toPakas: boolean) {
    this.adresesBox = new AdresesBox();
    this.adresesBox$ = this.adresesBox.init(this.adresesCsv.value, colMap, { toPakas });
  }

  savePasutijums(pasutijumsName: string): Observable<{ affectedRows: number; }> {
    /* Pievieno pasūtījuma nosaukumu datubāzei, saņem pasūtījuma id */
    let affectedRows: number = 0;
    let pasutijums: string;
    return this.pasutijumiService.addPasutijums(pasutijumsName).pipe(
      tap(pasId => pasutijums = pasId),
      switchMap(pasId => this.kastesService.uploadTable(this.adresesBox.uploadRow(pasId))),
      tap(res => affectedRows = res.affectedRows),
      switchMap(() => this.kastesPreferencesService.update({ pasutijums })),
      map(() => ({ affectedRows }))
    );
  }

}
