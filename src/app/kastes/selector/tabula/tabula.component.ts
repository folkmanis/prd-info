import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { VeikalsKaste } from '../../interfaces';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { KastesTabulaService } from '../services/kastes-tabula.service';
import { RowIdDirective } from './row-id.directive';


const COLUMNS = ['label', 'kods', 'adrese', 'yellow', 'rose', 'white', 'gatavs'];

@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.scss'],
  providers: [
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }
  ]
})
export class TabulaComponent {

  @ViewChild('container', { read: ScrollTopDirective }) private _scrollable: ScrollTopDirective;
  @ViewChildren(RowIdDirective) private _tableRows: QueryList<RowIdDirective>;

  selectedKaste: VeikalsKaste | undefined;

  preferences$ = this.preferencesService.preferences$;
  displayedColumns: string[] = COLUMNS;
  dataSource$: Observable<VeikalsKaste[]> = this.tabulaService.kastesApjoms$;
  totals$ = this.tabulaService.totals$;

  constructor(
    private dialogService: ConfirmationDialogService,
    private preferencesService: KastesPreferencesService,
    private tabulaService: KastesTabulaService,
  ) { }

  trackByFn(_: number, item: VeikalsKaste): string {
    return item._id + item.kaste;
  }

  scrollToTop() {
    this._scrollable?.scrollToTop();
  }

  scrollToId(kaste: VeikalsKaste) {
    const element = this._tableRows.find(el => el.kaste._id === kaste._id && el.kaste.kaste === kaste.kaste);
    if (!element) { return; }
    element.scrollIn();
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
      ).subscribe(resp => this.tabulaService.setPartialState(resp));
    } else {
      this.tabulaService.setGatavs(kaste, true)
        .subscribe(resp => this.tabulaService.setPartialState(resp));
    }
  }


}
