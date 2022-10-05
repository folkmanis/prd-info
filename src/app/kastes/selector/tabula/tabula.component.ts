import { Component, QueryList, ViewChild, ViewChildren, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { FormControl } from '@angular/forms';
import { merge, combineLatest, Observable, of, map, switchMap, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { VeikalsKaste } from '../../interfaces';
import { getKastesPreferences } from '../../services/kastes-preferences.service';
import { KastesTabulaService } from '../services/kastes-tabula.service';
import { RowIdDirective } from './row-id.directive';


const COLUMNS = ['label', 'kods', 'adrese', 'yellow', 'rose', 'white', 'gatavs'];

type VeikalsKasteId = Pick<VeikalsKaste, '_id' | 'kaste'>;

@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }
  ]
})
export class TabulaComponent {

  @ViewChild('scrollContainer', { read: ScrollTopDirective }) private _scrollable: ScrollTopDirective;
  @ViewChildren(RowIdDirective) private _tableRows: QueryList<RowIdDirective>;

  @Input() set veikalsKastes(value: VeikalsKaste[]) {
    value = Array.isArray(value) ? value : [];
    this.dataSource$.next(value);
  }

  @Output() gatavs = new Subject<VeikalsKaste>();

  dataSource$ = new ReplaySubject<VeikalsKaste[]>(1);

  selectedKaste: VeikalsKaste | undefined;

  colorCodes$ = getKastesPreferences('colors');
  displayedColumns: string[] = COLUMNS;

  constructor(
  ) { }

  trackByFn(_: number, item: VeikalsKasteId): string {
    return item._id + item.kaste;
  }

  scrollToTop() {
    this._scrollable?.scrollToTop();
  }

  scrollToId(kaste: VeikalsKasteId) {
    this._tableRows
      .find(el => el.kaste._id === kaste._id && el.kaste.kaste === kaste.kaste)
      ?.scrollIn();
  }

  onGatavs(kaste: VeikalsKaste): void {
    this.gatavs.next(kaste);
  }

}
