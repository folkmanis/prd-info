import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import {
  EMPTY,
  Observable,
  Subject,
  combineLatest,
  map,
  merge,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { cacheWithUpdate } from 'src/app/library/rxjs';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { KastesJob, Veikals } from '../../interfaces';
import { KastesPasutijumiService } from '../../services/kastes-pasutijumi.service';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { JobInfoComponent } from '../job-info/job-info.component';
import { PakosanasSarakstsComponent } from '../pakosanas-saraksts/pakosanas-saraksts.component';
import { AsyncPipe } from '@angular/common';

const VEIKALI_DELETED_MESSAGE = 'Pakošanas saraksts izdzēsts';

@Component({
  selector: 'app-pasutijums-edit',
  standalone: true,
  templateUrl: './pasutijums-edit.component.html',
  styleUrls: ['./pasutijums-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SimpleFormContainerComponent,
    JobInfoComponent,
    MatTabsModule,
    PakosanasSarakstsComponent,
    AsyncPipe,
  ],
})
export class PasutijumsEditComponent implements OnDestroy {
  private jobUpdate$ = new Subject<KastesJob>();
  private veikalsUpdate$ = new Subject<Veikals>();

  private job$: Observable<KastesJob> = merge(
    this.route.data.pipe(map((data) => data.kastesJob)),
    this.jobUpdate$
  );

  private veikali$: Observable<Veikals[]> = this.job$.pipe(
    switchMap((job) => this.pasService.getVeikali(job.jobId)),
    cacheWithUpdate(this.veikalsUpdate$, (o1, o2) => o1._id === o2._id)
  );

  private activeJobId$ = this.prefService.pasutijumsId$;

  jobInfo$ = combineLatest({
    job: this.job$,
    veikali: this.veikali$,
    activeJobId: this.activeJobId$,
  });

  constructor(
    private pasService: KastesPasutijumiService,
    private prefService: KastesPreferencesService,
    private confirmationDialog: ConfirmationDialogService,
    private snack: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.veikalsUpdate$.complete();
    this.jobUpdate$.complete();
  }

  onUpdateVeikals(veikals: Veikals) {
    this.pasService
      .updateOrderVeikals(veikals)
      .subscribe((veik) => this.veikalsUpdate$.next(veik));
  }

  onSetAsActive(pasutijums: number) {
    this.prefService.updateUserPreferences({ pasutijums }).subscribe();
  }

  onDeleteVeikali(jobId: number) {
    this.confirmationDialog
      .confirmDelete()
      .pipe(
        mergeMap((resp) =>
          resp ? this.pasService.deleteKastes(jobId) : EMPTY
        ),
        tap(() =>
          this.snack.open(VEIKALI_DELETED_MESSAGE, 'OK', { duration: 3000 })
        ),
        switchMap(() => this.pasService.getKastesJob(jobId))
      )
      .subscribe((job) => this.jobUpdate$.next(job));
  }
}
