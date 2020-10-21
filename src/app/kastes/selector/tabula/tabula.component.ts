import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Kaste } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { KastesTabulaService } from '../services/kastes-tabula.service';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';


const COLUMNS = ['kods', 'adrese', 'yellow', 'rose', 'white', 'gatavs'];

@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.scss'],
  providers: [
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }
  ]
})
export class TabulaComponent implements OnInit, OnDestroy {
@ViewChild('container', {read: ScrollTopDirective}) private _scrollable: ScrollTopDirective;

  constructor(
    private dialogService: ConfirmationDialogService,
    private preferencesService: KastesPreferencesService,
    private tabulaService: KastesTabulaService,
  ) { }

  selectedKaste: Kaste | undefined;

  preferences$ = this.preferencesService.preferences$;
  displayedColumns: string[] = COLUMNS;
  dataSource$: Observable<Kaste[]> = this.tabulaService.kastesApjoms$;

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onGatavs(row: Kaste): void {
    if (row.loading) { return; }
    row.loading = true;
    if (row.kastes.gatavs) {
      this.dialogService.confirm('Tiešām?').pipe(
        tap(resp => row.loading = resp),
        switchMap(resp => resp ? this.tabulaService.setGatavs(row, false) : EMPTY),
      ).subscribe();
    } else {
      this.tabulaService.setGatavs(row, true).subscribe();
    }
  }

  trackByFn(_: number, item: Kaste): string {
    return item._id + item.kaste;
  }

  scrollToTop() {
    this._scrollable.scrollToTop();
  }

}
