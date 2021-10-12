import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EMPTY, Observable, Subject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { ColorTotals } from '../interfaces';
import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { KastesPasutijumiService } from '../services/kastes-pasutijumi.service';
import { EndDialogComponent } from './end-dialog/end-dialog.component';
import { AdresesBox } from './services/adrese-box';
import { sortColorTotals, jobProductsToColorTotals } from '../common';
import { KastesJobPartial } from '../interfaces/kastes-job-partial';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent implements OnInit, OnDestroy {

  adresesBox: AdresesBox | undefined;

  orderIdControl = new FormControl(null, [Validators.required]);

  plannedTotals$: Observable<ColorTotals[]> = this.orderIdControl.valueChanges.pipe(
    switchMap((id: string) => this.pasutijumiService.getKastesJob(+id)),
    map(job => jobProductsToColorTotals(job.products)),
    shareReplay(1),
  );

  inputData$ = new Subject<Array<string | number>[]>();

  orders$: Observable<KastesJobPartial[]> = this.pasutijumiService.getKastesJobs({});

  colors$ = this.preferences.kastesSystemPreferences$.pipe(
    map(pref => pref.colors),
  );

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

  onSave(adrBox: AdresesBox) {
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

