import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { cacheWithUpdate } from 'prd-cdk';
import { map, mergeMap, shareReplay, switchMap, tap, EMPTY, merge, Observable, Subject } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { KastesJob, Veikals } from '../../interfaces';
import { KastesPasutijumiService } from '../../services/kastes-pasutijumi.service';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { KastesJobResolverService } from '../services/kastes-job-resolver.service';

const VEIKALI_DELETED_MESSAGE = 'Pakošanas saraksts izdzēsts';


@Component({
  selector: 'app-pasutijums-edit',
  templateUrl: './pasutijums-edit.component.html',
  styleUrls: ['./pasutijums-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasutijumsEditComponent implements OnInit, OnDestroy {

  private jobUpdate$ = new Subject<KastesJob>();
  private veikalsUpdate$ = new Subject<Veikals>();

  job$: Observable<KastesJob> = merge(
    this.route.data.pipe(map(data => data.value)),
    this.jobUpdate$,
  );

  veikali$: Observable<Veikals[]> = this.job$.pipe(
    switchMap(job => this.pasService.getVeikali(job.jobId)),
    cacheWithUpdate(this.veikalsUpdate$, (o1, o2) => o1._id === o2._id),
    shareReplay(1),
  );

  isVeikali$: Observable<boolean> = this.veikali$.pipe(
    map(veikali => veikali.length > 0)
  );

  activeJobId$ = this.prefService.pasutijumsId$;


  constructor(
    private pasService: KastesPasutijumiService,
    private prefService: KastesPreferencesService,
    private confirmationDialog: ConfirmationDialogService,
    private snack: MatSnackBar,
    private resolver: KastesJobResolverService,
    private route: ActivatedRoute,
  ) { }



  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.veikalsUpdate$.complete();
    this.jobUpdate$.complete();
  }

  onUpdateVeikals(veikals: Veikals) {
    this.pasService.updateOrderVeikals(veikals)
      .subscribe(veik => this.veikalsUpdate$.next(veik));
  }

  onSetAsActive(pasutijums: number) {
    this.prefService.updateUserPreferences({ pasutijums })
      .subscribe();
  }

  onDeleteVeikali(jobId: number) {
    this.confirmationDialog.confirmDelete().pipe(
      mergeMap(resp => resp ? this.pasService.deleteKastes(jobId) : EMPTY),
      tap(_ => this.snack.open(VEIKALI_DELETED_MESSAGE, 'OK', { duration: 3000 })),
      switchMap(_ => this.resolver.reload()),
    ).subscribe(job => this.jobUpdate$.next(job));
  }


}
