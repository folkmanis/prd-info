import { Injectable, EventEmitter } from '@angular/core';
import { switchMap, tap, map } from 'rxjs/operators';
import { Observable, of, merge } from 'rxjs';
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
  adresesCsv: AdresesCsv;
  adresesCsv$: Observable<AdresesCsv>;
  csvUpdate: EventEmitter<AdresesCsv> = new EventEmitter();
  adresesBox: AdresesBox;
  adresesBox$: Observable<AdreseBox[]>;

  constructor(
    private kastesPreferencesService: KastesPreferencesService,
    private pasutijumiService: PasutijumiService,
    private kastesService: KastesService,
  ) { }

  loadCsv(csv: string, delimiter: string = ',') {
    this.adresesCsv = new AdresesCsv();
    this.adresesCsv.setCsv(csv, delimiter);
    this.adresesCsv$ = merge(of(this.adresesCsv), this.csvUpdate);
  }

  public get adresesBoxTotals(): AdrBoxTotals {
    return {
      adreses: this.adresesBox.data.length,
      boxes: this.adresesBox.totals.boxCount,
      apjomi: this.adresesBox.apjomi,
    };
  }

  public get adresesTotals(): Totals {
    return this.adresesBox.totals;
  }
  /**
   * Izdzēš slejas, kuras norādītas masīvā
   * @param colMap Dzēšamās slejas norādītas ar true
   */
  deleteAdresesCsvColumns(colMap: {}) {
    this.adresesCsv.deleteColumns(colMap);
    this.csvUpdate.emit(this.adresesCsv);
  }

  joinAdresesCsvColumns(colMap: {}) {
    this.adresesCsv.joinColumns(colMap);
    this.csvUpdate.emit(this.adresesCsv);
  }

  deleteCsvRows(selected: any[]) {
    selected.forEach((selVal) => {
      const idx = this.adresesCsv.indexOf(selVal);
      if (idx > -1) {
        this.adresesCsv.splice(idx, 1);
      }
    });
    this.csvUpdate.emit(this.adresesCsv);
  }

  adresesToKastes(colMap: Map<number, string>, toPakas: boolean) {
    this.adresesBox = new AdresesBox();
    this.adresesBox$ = this.adresesBox.init(this.adresesCsv, colMap, { toPakas });
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
