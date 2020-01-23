import { Component, OnInit, ViewChild, Input, EventEmitter, OnChanges } from '@angular/core';
import { MatTable } from '@angular/material/table';

import { TabulaDataSource } from './tabula-datasource';
import { KastesService, Kaste } from '../services/kastes.service';
import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { KastesPreferences } from '../services/preferences';
import { Observable } from 'rxjs';

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
    this.loaded.emit(false);
    this.apjomsChange.emit(this.apjoms);
  }
  dataSource: TabulaDataSource;
  selectedKaste: number;
  apjomsChange = new EventEmitter<number>();
  rowChange = new EventEmitter<number>();
  preferences: KastesPreferences;
  loaded: EventEmitter<boolean> = new EventEmitter();
  displayedColumns = ['kods', 'adrese', 'yellow', 'rose', 'white', 'gatavs'];
  private apjoms = 0;

  constructor(
    private kastesService: KastesService,
    public preferencesService: KastesPreferencesService,
  ) {
    this.dataSource = new TabulaDataSource(this.kastesService, this.apjomsChange, this.rowChange, this.apjoms, this.loaded);
  }

  ngOnInit() {
    this.preferencesService.preferences.subscribe((pref) => this.preferences = pref);
  }

  onSelect(id: number) {
    this.selectedKaste = id;
  }

  onGatavs(id: number, gatavs: number): void {
    let action = 1;
    if (gatavs) {
      if (!confirm('Tiešām?')) {
        return;
      } else {
        action = 0;
      }
    }
    this.dataSource.setGatavs(id, action);
  }

  setLabel(nr: number): Observable<Kaste | null> {
    return this.dataSource.setLabel(nr);
  }
}
