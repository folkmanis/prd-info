import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { ColorTotals, KastesJobPartial } from 'src/app/interfaces';
import { ParserService } from 'src/app/library';
import * as XLSX from 'xlsx';
import { PasutijumiService } from '../services/pasutijumi.service';
import { AdresesBox } from './services/adrese-box';
import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { EndDialogComponent } from './end-dialog/end-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent implements OnInit, OnDestroy {

  orderIdControl = new FormControl(null, [Validators.required]);

  plannedTotals$: Observable<ColorTotals[]> = this.orderIdControl.valueChanges.pipe(
    switchMap((id: string) => this.pasutijumiService.getOrder(+id)),
    map(order => order.apjomsPlanned || []),
    map(plan => plan.map(pl => ({ ...pl, total: pl.total * 2 }))),
    shareReplay(1),
  );

  inputData$ = new Subject<Array<string | number>[]>();

  constructor(
    private pasutijumiService: PasutijumiService,
    private parserService: ParserService,
    private preferences: KastesPreferencesService,
    private matDialog: MatDialog,
  ) { }

  orders$: Observable<KastesJobPartial[]> = this.pasutijumiService.getKastesJobs({ veikali: false });

  colors$ = this.preferences.kastesSystemPreferences$.pipe(
    map(pref => pref.colors),
  );

  adresesBox$ = new Subject<AdresesBox | null>();

  ngOnInit() {
  }

  ngOnDestroy() {
    this.inputData$.complete();
  }

  onCsvDrop(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.parserService.parseCsv(fileReader.result.toString(), ';');
    };
    fileReader.readAsText(file);
  }

  onXlsDrop(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true }) as [][];
      this.inputData$.next(
        normalizeTable(data)
      );
    };
    fileReader.readAsBinaryString(file);
  }

  onSave(adrBox: AdresesBox) {
    this.savePasutijums(this.orderIdControl.value, adrBox)
      .subscribe();
  }

  private savePasutijums(orderId: number, adrBox: AdresesBox): Observable<number> {
    return this.pasutijumiService.addKastes(
      orderId,
      adrBox.uploadRow(orderId),
    ).pipe(
      switchMap(affectedRows => (this.preferences.updateUserPreferences({ pasutijums: orderId }) || EMPTY)
        .pipe(
          switchMap(_ => this.matDialog.open(EndDialogComponent, { data: affectedRows }).afterClosed()),
          map(_ => affectedRows)
        )
      ),
    );
  }

  onAdresesBox(adr: AdresesBox) {
    console.log(adr);
    this.adresesBox$.next(adr);
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

