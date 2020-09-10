import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ParserService } from 'src/app/library';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { AdrBoxTotals, AdreseBox, AdresesBox, Totals } from './adrese-box';
import { AdresesCsv } from './adrese-csv';

@Injectable()
export class UploadService {
  adresesCsv = new AdresesCsv(this.parserService);
  adresesBox: AdresesBox;
  adresesBox$: Observable<AdreseBox[]>;

  constructor(
    private kastesPreferencesService: KastesPreferencesService,
    private prdApi: PrdApiService,
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

  addEmptyColumn() {
    this.adresesCsv.addColumn();
  }

  adresesToKastes(colMap: Map<string, string>, toPakas: boolean) {
    this.adresesBox = new AdresesBox();
    this.adresesBox$ = this.adresesBox.init(this.adresesCsv.value, colMap, { toPakas });
  }

  savePasutijums(orderId: number): Observable<number> {
    return this.prdApi.kastes.putTable({
      orderId,
      data: this.adresesBox.uploadRow(orderId)
    }).pipe(
      switchMap(affectedRows => this.kastesPreferencesService.updateUserPreferences({ pasutijums: orderId })
        .pipe(
          map(() => affectedRows)
        )),
    );
  }

}
