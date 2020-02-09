import { Component, OnInit, ViewChild, Input, EventEmitter, OnChanges } from '@angular/core';
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
export class TabulaComponent implements OnInit {
  @ViewChild(MatTable, { static: false }) table: MatTable<Kaste>;
  @Input()
  set setApjoms(apj: number) {
    this.apjoms = apj;
    this.loaded$.next(false);
    this.apjomsChange.emit(this.apjoms);
  }
  dataSource: TabulaDataSource;
  selectedKaste: Kaste;
  apjomsChange = new EventEmitter<number>();
  rowChange = new EventEmitter<number>();
  preferences: KastesPreferences;
  private loaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  displayedColumns = ['kods', 'adrese', 'yellow', 'rose', 'white', 'gatavs'];
  private apjoms = 0;
  loaded = false;

  constructor(
    private kastesService: KastesService,
    private dialogService: ConfirmationDialogService,
    public preferencesService: KastesPreferencesService,
  ) {
    this.dataSource = new TabulaDataSource(this.kastesService, this.apjomsChange, this.rowChange, this.apjoms, this.loaded$);
  }

  ngOnInit() {
    this.preferencesService.preferences.subscribe((pref) => this.preferences = pref);
    this.loaded$.subscribe(ld => this.loaded = ld);
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
