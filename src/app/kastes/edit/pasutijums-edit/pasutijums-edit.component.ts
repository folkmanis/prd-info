import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, EMPTY, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, mapTo, mergeMap, pluck, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { KastesJob, Veikals } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library';
import { cacheWithUpdate, DestroyService } from 'src/app/library/rx';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { PasutijumiService } from '../../services/pasutijumi.service';
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
    private pasService: PasutijumiService,
    private prefService: KastesPreferencesService,
    private confirmationDialog: ConfirmationDialogService,
    private snack: MatSnackBar,
    private resolver: KastesJobResolverService,
  ) { }

  private _veikalsUpdate$ = new Subject<Veikals>();

  jobInit$ = new ReplaySubject<KastesJob>(1);
  job$: Observable<KastesJob> = this.jobInit$.pipe(
    mergeMap(job => combineLatest([
      of(job),
      of(job.veikali).pipe(
        cacheWithUpdate(this._veikalsUpdate$, this.compareFn),
      )
    ])),
    map(([job, veikali]) => ({ ...job, veikali })),
    shareReplay(1),
  );
  veikali$: Observable<Veikals[]> = this.job$.pipe(pluck('veikali'));

  dataUpdate$ = new Subject<KastesJob>();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._veikalsUpdate$.complete();
    this.dataUpdate$.complete();
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
