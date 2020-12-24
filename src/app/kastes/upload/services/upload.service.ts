import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { AdresesBox } from './adrese-box';
import { AdresesCsv } from './adrese-csv';

@Injectable()
export class UploadService {
  private adresesCsv: AdresesCsv;

  private readonly _adresesCsv$ = new ReplaySubject<Array<string | number>[]>(1);
  adresesCsv$ = this._adresesCsv$.asObservable();

  private readonly _columns$ = new ReplaySubject<string[]>(1);
  columns$ = this._columns$.asObservable();

  rowSelection = new SelectionModel<number>(true);

  constructor(
  ) { }

  get colNames(): string[] {
    return this.adresesCsv.colNames;
  }

  loadData(data: Array<string | number>[]) {
    this.rowSelection.clear();
    this.adresesCsv = new AdresesCsv(data);
    this.rowSelection.select(...this.adresesCsv.value.map((_, idx) => idx));
    this.emitAdresesCsv();
  }

  deleteAdresesCsvColumns(colMap: boolean[]) {
    this.adresesCsv.deleteColumns(colMap);
    this.emitAdresesCsv();
  }

  joinAdresesCsvColumns(colMap: boolean[]) {
    this.adresesCsv.joinColumns(colMap);
    this.emitAdresesCsv();
  }

  addEmptyColumn() {
    this.adresesCsv.addColumn();
    this.emitAdresesCsv();
  }

  adresesToKastes(colMap: Map<string, string>, toPakas: boolean): AdresesBox {
    return new AdresesBox(this.adresesCsv.value, colMap, toPakas);
  }

  private emitAdresesCsv(): void {
    this._columns$.next(this.adresesCsv.colNames);
    this._adresesCsv$.next(this.adresesCsv.value);
  }

}
