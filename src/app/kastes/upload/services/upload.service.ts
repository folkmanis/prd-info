import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ParserService } from 'src/app/library';
import { KastesApiService } from '../../services/kastes-api.service';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { PasutijumiService } from '../../services/pasutijumi.service';
import { AdrBoxTotals, AdreseBox, AdresesBox, Totals } from './adrese-box';
import { AdresesCsv } from './adrese-csv';

@Injectable()
export class UploadService {
  adresesCsv = new AdresesCsv(this.parserService);
  adresesBox: AdresesBox;
  adresesBox$: Observable<AdreseBox[]>;

  constructor(
    private kastesPreferencesService: KastesPreferencesService,
    private pasutijumiService: PasutijumiService,
    private kastesApi: KastesApiService,
    private parserService: ParserService,
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

  loadXls(xls: [][]) {
    this.adresesCsv.setJson(xls);
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
    this.adresesCsv.joinColumns(colMap);
  }

  deleteCsvRows(selected: any[]) {
    this.adresesCsv.deleteRows(selected);
  }

  adresesToKastes(colMap: Map<string, string>, toPakas: boolean) {
    this.adresesBox = new AdresesBox();
    this.adresesBox$ = this.adresesBox.init(this.adresesCsv.value, colMap, { toPakas });
  }

  savePasutijums(pasutijumsName: string): Observable<number> {
    /* Pievieno pasūtījuma nosaukumu datubāzei, saņem pasūtījuma id */
    let affectedRows = 0;
    let pasutijums: string;
    return this.pasutijumiService.addPasutijums(pasutijumsName).pipe(
      tap(pasId => pasutijums = pasId),
      // switchMap(pasId => this.kastesHttpService.uploadTableHttp(this.adresesBox.uploadRow(pasId))),
      mergeMap(pasId => this.kastesApi.kastes.putTable(this.adresesBox.uploadRow(pasId))),
      tap(resp => affectedRows = resp),
      switchMap(() => this.kastesPreferencesService.updateUserPreferences({ pasutijums })),
      map(() => affectedRows)
    );
  }

}
