import { Injectable, EventEmitter } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Observable, of, merge } from 'rxjs';
import { PreferencesService } from '../services/preferences.service';
import { Kaste } from '../services/kastes.service';
import { AdresesCsv } from './adrese-csv';
import { AdreseBox, AdresesBox, AdrBoxTotals, Totals } from './adrese-box';
import { AdminHttpService } from '../services/admin-http.service';
import { AdminPasutijumsService } from '../services/admin-pasutijums.service';

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
    private preferencesService: PreferencesService,
    private adminPasutijumsService: AdminPasutijumsService,
    private adminHttpService: AdminHttpService,
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

  savePasutijums(pasutijumsName: string): Observable<{ affectedRows: number }> {
    /* Pievieno pasūtījuma nosaukumu datubāzei, saņem pasūtījuma id */
    return this.adminPasutijumsService.addPasutijums(pasutijumsName).pipe(
      /* Uzliek jaunā pasūtījuma id preferencēs kā aktīvo */
      switchMap((id) => this.preferencesService.setPreferences({ pasutijums: id })),
      /* Ielādē pasūtījuma datus datubāzē */
      switchMap((prefs) =>
        this.adminHttpService.uploadTableHttp<Kaste>(this.adresesBox.uploadRow.map((sel, idx) => {
          /* Array.map funkcija pievieno trūkstošos lauciņus,
          lai veidotos pilns Kastes json objekts */
          return { ...sel, gatavs: 0, label: 0, pasutijums: prefs.pasutijums, Nr: idx + 1 };
        }))),
    );
  }

}
