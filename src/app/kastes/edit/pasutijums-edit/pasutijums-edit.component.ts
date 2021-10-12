import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, EMPTY, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { filter, map, mapTo, mergeMap, pluck, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { KastesJob, Veikals } from '../../interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { cacheWithUpdate, DestroyService } from 'prd-cdk';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { KastesPasutijumiService } from '../../services/kastes-pasutijumi.service';
import { KastesJobResolverService } from '../services/kastes-job-resolver.service';

const VEIKALI_DELETED_MESSAGE = 'Pakošanas saraksts izdzēsts';

@Component({
  selector: 'app-pasutijums-edit',
  templateUrl: './pasutijums-edit.component.html',
  styleUrls: ['./pasutijums-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasutijumsEditComponent implements OnInit, OnDestroy {

  constructor(
    private pasService: KastesPasutijumiService,
    private prefService: KastesPreferencesService,
    private confirmationDialog: ConfirmationDialogService,
    private snack: MatSnackBar,
    private resolver: KastesJobResolverService,
  ) { }

  private _veikalsUpdate$ = new Subject<Veikals>();

  readonly job$ = new ReplaySubject<KastesJob>(1);
  readonly veikali$: Observable<Veikals[]> = this.job$.pipe(
    filter(job => !!job),
    switchMap(job => this.pasService.getVeikali(job.jobId)),
    cacheWithUpdate(this._veikalsUpdate$, this.compareFn),
    shareReplay(1),
  );

  readonly isVeikali$: Observable<boolean> = this.veikali$.pipe(
    map(veikali => veikali.length > 0)
  );

  readonly dataUpdate$ = new Subject<KastesJob>();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._veikalsUpdate$.complete();
    this.dataUpdate$.complete();
  }

  setJob(job: KastesJob) {
    this.job$.next(job);
  }

  onUpdateVeikals(veikals: Veikals) {
    // TODO handel error
    this.pasService.updateOrderVeikals(veikals)
      .subscribe(veik => this._veikalsUpdate$.next(veik));
  }

  onSetAsActive(pasutijums: number) {
    this.prefService.updateUserPreferences({ pasutijums })
      .subscribe();
  }

  onDeleteVeikali() {
    this.job$.pipe(
      take(1),
      pluck('jobId'),
      switchMap(jobid => this.confirmationDialog.confirmDelete().pipe(
        mergeMap(resp => resp ? this.pasService.deleteKastes(jobid) : EMPTY),
        tap(_ => this.snack.open(VEIKALI_DELETED_MESSAGE, 'OK', { duration: 3000 })),
        switchMap(_ => this.resolver.reload()),
      )),
    ).subscribe(job => this.dataUpdate$.next(job));
  }

  private compareFn(o1: Veikals, o2: Veikals): boolean {
    return o1.kods === o2.kods;
  }


}
