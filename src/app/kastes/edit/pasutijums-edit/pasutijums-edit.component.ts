import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, numberAttribute } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import {
  EMPTY,
  Subject,
  merge,
  mergeMap,
  shareReplay,
  switchMap,
  tap
} from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { cacheWithUpdate } from 'src/app/library/rxjs';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { KastesJob, Veikals } from '../../interfaces';
import { KastesPasutijumiService } from '../../services/kastes-pasutijumi.service';
import { KastesPreferencesService, kastesPreferences } from '../../services/kastes-preferences.service';
import { JobInfoComponent } from '../job-info/job-info.component';
import { PakosanasSarakstsComponent } from '../pakosanas-saraksts/pakosanas-saraksts.component';

const VEIKALI_DELETED_MESSAGE = 'Pakošanas saraksts izdzēsts';

const FIREBASE_COPY_TO_CONFIRMATION = 'Kopēt visus ierakstus uz lietotni?';
const FIREBASE_COPY_FROM_CONFIRMATION = 'Kopēt datus no lietotnes?';
const firebaseCopyToResultMessage = (count: number) =>
  `Uzkopēti ${count} ieraksti.`;
const firebaseCopyFromResultMessage = (count: number) =>
  `Saņemti ${count} ieraksti no lietotnes.`;

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
export class PasutijumsEditComponent {

  private pasutijumiService = inject(KastesPasutijumiService);
  private preferencesService = inject(KastesPreferencesService);
  private confirmationDialog = inject(ConfirmationDialogService);
  private snack = inject(MatSnackBar);

  private jobUpdate$ = new Subject<KastesJob>();
  private veikalsUpdate$ = new Subject<Veikals>();

  jobId = input.required({ transform: numberAttribute });

  activeJobId = kastesPreferences('pasutijums');

  job$ = merge(
    toObservable(this.jobId)
      .pipe(
        mergeMap(id => this.pasutijumiService.getKastesJob(id)),
        shareReplay(1),
      ),
    this.jobUpdate$,
  );

  veikali = toSignal(
    this.job$.pipe(
      switchMap((job) => this.pasutijumiService.getVeikali(job.jobId)),
      cacheWithUpdate(this.veikalsUpdate$, (o1, o2) => o1._id === o2._id)
    ),
    { initialValue: [] }
  );

  onUpdateVeikals(veikals: Veikals) {
    this.pasutijumiService
      .updateOrderVeikals(veikals)
      .subscribe((veik) => this.veikalsUpdate$.next(veik));
  }

  setAsActive() {
    const pasutijums = this.jobId();
    this.preferencesService.updateUserPreferences({ pasutijums }).subscribe();
  }

  deleteVeikali() {
    const jobId = this.jobId();
    this.confirmationDialog
      .confirmDelete()
      .pipe(
        mergeMap((resp) =>
          resp ? this.pasutijumiService.deleteKastes(jobId) : EMPTY
        ),
        tap(() =>
          this.snack.open(VEIKALI_DELETED_MESSAGE, 'OK', { duration: 3000 })
        ),
        switchMap(() => this.pasutijumiService.getKastesJob(jobId))
      )
      .subscribe((job) => this.jobUpdate$.next(job));
  }

  copyToFirebase() {
    const jobId = this.jobId();
    this.confirmationDialog
      .confirm(FIREBASE_COPY_TO_CONFIRMATION)
      .pipe(
        mergeMap((resp) =>
          resp ? this.pasutijumiService.copyToFirestore(jobId) : EMPTY
        ),
        tap((result) =>
          this.snack.open(
            firebaseCopyToResultMessage(result.recordsUpdated),
            'OK',
            { duration: 3000 }
          )
        )
      )
      .subscribe();
  }

  copyFromFirebase() {
    const jobId = this.jobId();
    this.confirmationDialog
      .confirm(FIREBASE_COPY_FROM_CONFIRMATION)
      .pipe(
        mergeMap((resp) =>
          resp ? this.pasutijumiService.copyFromFirestore(jobId) : EMPTY
        ),
        tap((result) =>
          this.snack.open(
            firebaseCopyFromResultMessage(result.modifiedCount),
            'OK',
            { duration: 3000 }
          )
        )
      )
      .subscribe();
  }
}
