import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, AsyncValidatorFn, AbstractControl, FormGroupDirective } from '@angular/forms';
import { UploadService } from './services/upload.service';
import { PasutijumiService } from '../services/pasutijumi.service';
import { map, tap, take, filter, switchMap, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EndDialogComponent } from './end-dialog/end-dialog.component';
import * as XLSX from 'xlsx';
import { Observable } from 'rxjs';
import { KastesOrderPartial, ColorTotals } from 'src/app/interfaces';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  private defaultText = 'Atlasīt csv vai xls failu';
  displayText: string = this.defaultText;
  fileLoaded = false; // Ielādēts fails
  boxGatavi = false; // Sagatavots sadalījums pa kastēm

  orderIdControl = new FormControl(null, [Validators.required]);

  plannedTotals$: Observable<ColorTotals[]> = this.orderIdControl.valueChanges.pipe(
    switchMap((id: string) => this.pasutijumiService.getOrder(id)),
    map(order => order.apjomsPlanned || []),
    shareReplay(1),
  );

  constructor(
    private uploadService: UploadService,
    private pasutijumiService: PasutijumiService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  orders$: Observable<KastesOrderPartial[]> = this.pasutijumiService.pasutijumi$.pipe(
    map(orders => orders.filter(ordr => !ordr.deleted && !ordr.isLocked))
  );

  ngOnInit() {
  }

  onFileDrop(fileList: FileList) {
    this.clearFile();
    if (fileList.length !== 1) {
      this.displayText = 'Tieši vienu failu!';
      return;
    }
    if (fileList[0].size > 200 * 1024) {
      this.displayText = 'Maksimālais faila izmērs 200kb';
      this.clearFile();
      return;
    }
    if (fileList[0].name.endsWith('.csv')) {
      this.readCsv(fileList[0]);
      return;
    }
    if (fileList[0].name.endsWith('.xls') || fileList[0].name.endsWith('xlsx')) {
      this.readXls(fileList[0]);
      return;
    }
  }

  clearFile() {
    this.displayText = this.defaultText;
    this.fileLoaded = false;
    this.boxGatavi = false;
  }

  onSubmitAll() {
    this.uploadService.savePasutijums(this.orderIdControl.value)
      .subscribe(rows => this.finalDialog(rows)
      );
  }

  finalDialog(affectedRows: number): void {
    const dialogRef = this.dialog.open(EndDialogComponent, { width: '400px', disableClose: true, data: { rows: affectedRows } });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['kastes', 'tabula', 'selector', 0]);
    });
  }

  private readCsv(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.uploadService.loadCsv(fileReader.result.toString(), ';');
      this.onFileLoaded(file);
    };
    fileReader.readAsText(file);
  }

  private readXls(file: File) {
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
      this.uploadService.loadXls(data);
      this.onFileLoaded(file);
    };
    fileReader.readAsBinaryString(file);
  }

  private onFileLoaded(file: File) {
    // this.pasutijumsForm.patchValue({ pasutijumsName: file.name.replace(/\.[^/.]+$/, '') });
    this.fileLoaded = true;
    this.displayText = `Augšupielādei sagatavots fails: ${file.name} / ${file.size} bytes / ${file.type}`;
  }
}
