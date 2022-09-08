import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { jobProductsToColorTotals } from '../common';
import { ColorTotals } from '../interfaces';
import { KastesJobPartial } from '../interfaces/kastes-job-partial';
import { KastesPasutijumiService } from '../services/kastes-pasutijumi.service';
import { getKastesPreferences, KastesPreferencesService } from '../services/kastes-preferences.service';
import { EndDialogComponent } from './end-dialog/end-dialog.component';
import { AdresesBoxes } from './services/adrese-box';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent implements OnInit, OnDestroy {

  adresesBox: AdresesBoxes | undefined;

  orderIdControl = new UntypedFormControl(null, [Validators.required]);

  plannedTotals$: Observable<ColorTotals[]> = this.orderIdControl.valueChanges.pipe(
    switchMap((id: string) => this.pasutijumiService.getKastesJob(+id)),
    map(job => jobProductsToColorTotals(job.products)),
    shareReplay(1),
  );

  inputData$ = new Subject<Array<string | number>[]>();

  orders$: Observable<KastesJobPartial[]> = this.pasutijumiService.getKastesJobs({});

  colors$ = getKastesPreferences('colors');

  constructor(
    private pasutijumiService: KastesPasutijumiService,
    private preferences: KastesPreferencesService,
    private matDialog: MatDialog,
    private router: Router,
  ) { }


  ngOnInit() {
  }

  ngOnDestroy() {
    this.inputData$.complete();
  }

  onXlsDrop(file: File | undefined) {

    this.pasutijumiService.parseXlsx(file)
      .subscribe(data => this.inputData$.next(data));

  }

  onSave(adrBox: AdresesBoxes) {
    const orderId = this.orderIdControl.value;
    if (!orderId) { return; }
    this.pasutijumiService.addKastes(
      adrBox.uploadRows(orderId)
    ).pipe(
      switchMap(affectedRows => this.matDialog.open(EndDialogComponent, { data: affectedRows }).afterClosed()),
      switchMap(_ => this.preferences.updateUserPreferences({ pasutijums: orderId })),
    )
      .subscribe(_ => this.router.navigate(['kastes', 'edit', orderId]));
  }

}

