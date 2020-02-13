import { Component, OnInit, ViewChild, Input, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { MatTable } from '@angular/material/table';

import { TabulaDataSource } from './tabula-datasource';
import { KastesService, Kaste } from '../services/kastes.service';
import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { KastesPreferences } from '../services/preferences';
import { Observable, BehaviorSubject } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.css']
})
export class TabulaComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table: MatTable<Kaste>;
  dataSource: TabulaDataSource;
  selectedKaste: Kaste;
  rowChange = new EventEmitter();
  preferences: KastesPreferences;
  private loaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  displayedColumns = ['kods', 'adrese', 'yellow', 'rose', 'white', 'gatavs'];
  // loaded = false;

  constructor(
    private kastesService: KastesService,
    private dialogService: ConfirmationDialogService,
    public preferencesService: KastesPreferencesService,
  ) {
    this.dataSource = new TabulaDataSource(this.kastesService, this.rowChange, this.loaded$);
  }

  ngOnInit() {
    this.preferencesService.preferences.subscribe((pref) => this.preferences = pref);
    // this.loaded$.subscribe(ld => this.loaded = ld);
  }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;
  }

  onGatavs(id: string, kaste: number, gatavs: boolean): void {
    if (gatavs) {
      this.dialogService.confirm('Tiešām?').pipe(
        filter(resp => resp),
        switchMap(() => this.dataSource.setGatavs(id, kaste, false))
      ).subscribe();
    } else {
      this.dataSource.setGatavs(id, kaste, true).subscribe();
    }
  }

  setLabel(kods: number): Observable<Kaste | null> {
    return this.dataSource.setLabel(kods);
  }
}
