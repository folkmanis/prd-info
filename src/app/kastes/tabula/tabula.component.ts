import { Component, OnInit, OnDestroy, ViewChild, Input, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
// import { TabulaDataSource } from './tabula-datasource';
import { KastesService } from '../services/kastes.service';
import { Kaste, Totals } from '../services/kaste.class';

import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { KastesPreferences } from '../services/preferences';
import { Observable, BehaviorSubject, Subject, of, EMPTY, combineLatest } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { filter, switchMap, map, delay, mergeMap, tap, take } from 'rxjs/operators';


@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.css'],
  providers: [
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }
  ]
})
export class TabulaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatTable) table: MatTable<Kaste>;
  // dataSource: TabulaDataSource;
  selectedKaste: Kaste;
  // rowChange = new EventEmitter();
  preferences$: Observable<KastesPreferences> = this.preferencesService.preferences;
  displayedColumns = ['kods', 'adrese', 'yellow', 'rose', 'white', 'gatavs'];
  totals$: Observable<Totals>;

  constructor(
    private kastesService: KastesService,
    private dialogService: ConfirmationDialogService,
    private preferencesService: KastesPreferencesService,
  ) {
    // this.dataSource = new TabulaDataSource(this.kastesService);
    this.totals$ = kastesService.totals$;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.table.dataSource = this.kastesService.kastes$;
  }

  ngOnDestroy() {
    this.kastesService.disconnect();
  }

  onGatavs(row: Kaste): void {
    if (row.loading) { return; }
    row.loading = true;
    if (row.kastes.gatavs) {
      this.dialogService.confirm('Tiešām?').pipe(
        mergeMap(resp => resp ? this.kastesService.setGatavs(row, 'gatavs', false) : of(false)),
      ).subscribe();
    } else {
      this.kastesService.setGatavs(row, 'gatavs', true)
        .subscribe();
    }
  }

  setLabel(kods: number): Observable<Kaste | null> {
    return this.kastesService.kastesAll$.pipe(
      take(1),
      map(kastes=>kastes.find(kaste=>kaste.kods === kods && !kaste.kastes.uzlime)),
      mergeMap(rw=> rw ? this.kastesService.setGatavs(rw, 'uzlime', true):of(null)),
    )
  }
}
