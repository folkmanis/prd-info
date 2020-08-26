import { Component, OnInit, OnDestroy, ViewChild, Input, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { Kaste } from 'src/app/interfaces';

import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { Observable, BehaviorSubject, Subject, of, EMPTY, combineLatest, ReplaySubject } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { filter, switchMap, map, delay, mergeMap, tap, take } from 'rxjs/operators';

import { KastesTabulaService } from '../../services/kastes-tabula.service';

const COLUMNS = ['kods', 'adrese', 'yellow', 'rose', 'white'];

@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.css'],
  providers: [
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }
  ]
})
export class TabulaComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() forLabels = false;

  constructor(
    private dialogService: ConfirmationDialogService,
    private preferencesService: KastesPreferencesService,
    private tabulaService: KastesTabulaService,
  ) { }

  selectedKaste: Kaste | undefined;

  preferences$ = this.preferencesService.preferences$;
  displayedColumns: string[] = []; // = ['kods', 'adrese', 'yellow', 'rose', 'white', 'gatavs'];
  dataSource$: Observable<Kaste[]> = this.tabulaService.kastesApjoms$;

  ngOnInit() {
    this.displayedColumns = this.forLabels ? [...COLUMNS] : COLUMNS.concat('gatavs');
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  onGatavs(row: Kaste): void {
    if (row.loading) { return; }
    row.loading = true;
    if (row.kastes.gatavs) {
      this.dialogService.confirm('Tiešām?').pipe(
        tap(resp => row.loading = resp),
        switchMap(resp => resp ? this.tabulaService.setGatavs(row, false) : EMPTY
        ),
      ).subscribe();
    } else {
      this.tabulaService.setGatavs(row, true).subscribe();
    }
  }

  trackByFn(_: number, item: Kaste): string {
    return item._id + item.kaste;
    //  + item.lastModified;
  }

}
