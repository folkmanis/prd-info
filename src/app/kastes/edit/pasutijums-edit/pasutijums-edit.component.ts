import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, mapTo, mergeMap, shareReplay, take, tap } from 'rxjs/operators';
import { KastesJob, Veikals } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library';
import { cacheWithUpdate, DestroyService } from 'src/app/library/rx';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { PasutijumiService } from '../../services/pasutijumi.service';

const VEIKALI_DELETED_MESSAGE = 'Pakošanas saraksts izdzēsts';

@Component({
  selector: 'app-pasutijums-edit',
  templateUrl: './pasutijums-edit.component.html',
  styleUrls: ['./pasutijums-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasutijumsEditComponent implements OnInit, OnDestroy {

  constructor(
    private pasService: PasutijumiService,
    private prefService: KastesPreferencesService,
    private confirmationDialog: ConfirmationDialogService,
    private snack: MatSnackBar,
  ) { }

  private _veikalsUpdate$ = new Subject<Veikals>();
  private _veikaliInitial$ = new ReplaySubject<Veikals[]>(1);

  veikali$: Observable<Veikals[]> = this._veikaliInitial$.pipe(
    cacheWithUpdate(this._veikalsUpdate$, this.compareFn),
    shareReplay(1),
  );

  kastesJobOmitVeikali$ = new ReplaySubject<Omit<KastesJob, 'veikali'>>(1);

  onData(data: KastesJob): void {
    this.kastesJobOmitVeikali$.next(data);
    this._veikaliInitial$.next(data.veikali || []);
    console.log(data.totals);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._veikaliInitial$.complete();
    this._veikalsUpdate$.complete();
  }

  onUpdateVeikals(veikals: Veikals) {
    this.pasService.updateOrderVeikali([veikals]).pipe(
      mergeMap(count => count === 1 ? of(veikals) : EMPTY),
    ).subscribe(veik => this._veikalsUpdate$.next(veik));
  }

  onSetAsActive(pasutijums: number) {
    this.prefService.updateUserPreferences({ pasutijums })
      .subscribe();
  }

  onDeleteVeikali(pasutijums: number) {
    this.confirmationDialog.confirmDelete().pipe(
      mergeMap(resp => resp ? this.pasService.deleteKastes(pasutijums) : EMPTY),
    );
  }

  private compareFn(o1: Veikals, o2: Veikals): boolean {
    return o1.kods === o2.kods;
  }


}
