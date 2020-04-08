import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../library/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TabulaDatasource } from './tabula-datasource';
import { PasutijumiService } from '../services/pasutijumi.service';
import { Pasutijums } from '../services/pasutijums';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-pasutijumi',
  templateUrl: './pasutijumi.component.html',
  styleUrls: ['./pasutijumi.component.css']
})
export class PasutijumiComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table: MatTable<Pasutijums>;
  dataSource: TabulaDatasource;
  displayedColumns = ['name', 'deleted', 'created'];

  new = false;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private pasutijumiService: PasutijumiService,
  ) {
  }

  ngOnInit() {
    this.dataSource = new TabulaDatasource(this.pasutijumiService);
  }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;
  }

  onCheckDeleted(pas: Pasutijums, ev: MatCheckboxChange) {
    this.dataSource.updatePas({ _id: pas._id, deleted: ev.checked }).subscribe();
  }

  onCleanup() {
    const dialogref = this.dialog.open(ConfirmationDialogComponent,
      {
        data: {
          prompt: `Vai tiešām dzēst visus neaktīvos pasūtījumus
        un tiem atbilstošos pakošanas sarakstus?`
        }
      });
    dialogref.afterClosed().pipe(
      filter(resp => resp),
      switchMap(() => this.pasutijumiService.cleanup()),
    ).subscribe(resp => {
      this.snackBar.open(
        resp
          ? `Likvidēti ${resp.deleted.pasutijumi} pasūtījumi un ${resp.deleted.veikali} pakošanas ieraksti`
          : 'Kaut kas nogāja greizi',
        'OK',
        { duration: 3000 });
    });
  }

  onNew() {
    console.log('Jauns pasūtījums');
    this.new = !this.new;
  }

}
