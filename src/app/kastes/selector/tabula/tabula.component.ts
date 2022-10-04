import { Component, QueryList, ViewChild, ViewChildren, ChangeDetectionStrategy, Input } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { FormControl } from '@angular/forms';
import { merge, combineLatest, Observable, of, map, switchMap } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { VeikalsKaste } from '../../interfaces';
import { getKastesPreferences } from '../../services/kastes-preferences.service';
import { KastesTabulaService } from '../services/kastes-tabula.service';
import { RowIdDirective } from './row-id.directive';


const COLUMNS = ['label', 'kods', 'adrese', 'yellow', 'rose', 'white', 'gatavs'];

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

  @Input() pendingCount = 0;

  selectedKaste: VeikalsKaste | undefined;

  colorCodes$ = getKastesPreferences('colors');
  displayedColumns: string[] = COLUMNS;
  totals$ = this.tabulaService.totals$;

  showCompleted = new FormControl<boolean>(true);
  private showCompleted$ = merge(of(this.showCompleted.value), this.showCompleted.valueChanges);

  dataSource$: Observable<VeikalsKaste[]> = combineLatest([
    this.tabulaService.kastesApjoms$,
    this.showCompleted$,
  ])
    .pipe(
      map(([data, shCompl]) => data.filter(k => shCompl || !k.kastes.gatavs))
    );

  constructor(
    private dialogService: ConfirmationDialogService,
    private tabulaService: KastesTabulaService,
  ) { }

  trackByFn(_: number, item: VeikalsKaste): string {
    return item._id + item.kaste;
  }

  scrollToTop() {
    this._scrollable?.scrollToTop();
  }

  scrollToId(kaste: VeikalsKaste) {
    this._tableRows
      .find(el => el.kaste._id === kaste._id && el.kaste.kaste === kaste.kaste)
      ?.scrollIn();
  }

  onReload() {
    this.tabulaService.reloadState();
    this.scrollToTop();
  }

  onGatavs(kaste: VeikalsKaste): void {

    if (kaste.loading) {
      return;
    }

    this.tabulaService.setPartialState({
      ...kaste,
      loading: true,
    });

    if (kaste.kastes.gatavs) {
      this.dialogService.confirm('Tiešām?').pipe(
        switchMap(resp => resp ? this.tabulaService.setGatavs(kaste, false) : of(kaste)),
      ).subscribe();
    } else {
      this.tabulaService.setGatavs(kaste, true)
        .subscribe();
    }
  }


}
