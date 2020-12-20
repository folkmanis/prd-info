import { Component, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { share, tap, map, switchMap, filter, pluck, shareReplay, mergeMap } from 'rxjs/operators';
import { PasutijumiService } from '../../services/pasutijumi.service';
import { Colors, ColorTotals, KastesJob } from 'src/app/interfaces';
import { Observable, MonoTypeOperatorFunction, merge, of, EMPTY, Subject } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { JobService } from 'src/app/services/job.service';
import { JobFormSource } from '../services/job-form-source';
import { IFormGroup } from '@rxweb/types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeletedSnackbarComponent } from './deleted-snackbar/deleted-snackbar.component';
import { PasutijumiResolverService } from '../services/pasutijumi-resolver.service';

@Component({
  selector: 'app-pasutijums-id',
  templateUrl: './pasutijums-id.component.html',
  styleUrls: ['./pasutijums-id.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasutijumsIdComponent implements CanComponentDeactivate {

  readonly colors: Colors[] = ['yellow', 'rose', 'white'];

  constructor(
    private fb: FormBuilder,
    private prefService: KastesPreferencesService,
    private jobService: JobService,
    private pasutijumiService: PasutijumiService,
    private confirmationDialog: ConfirmationDialogService,
    private snack: MatSnackBar,
    private resolver: PasutijumiResolverService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  formSource = new JobFormSource(this.fb, this.jobService, this.resolver);
  get form(): IFormGroup<KastesJob> { return this.formSource.form; }

  reload$ = new Subject<void>();

  deleteKastes$ = new Subject<number>();

  job$: Observable<KastesJob> = merge(
    this.route.data.pipe(
      map(d => d.value as KastesJob | undefined),
    ),
    this.reload$.pipe(
      switchMap(_ => this.resolver.reload())
    ),
    this.deleteKastes$.pipe(
      mergeMap(pasutijums => this.confirmationDialog.confirmDelete().pipe(
        switchMap(resp => resp ? this.pasutijumiService.deleteKastes(pasutijums) : EMPTY),
        tap(deleted => this.snack.openFromComponent(DeletedSnackbarComponent, { data: deleted, duration: 3000 })),
        switchMap(_ => this.resolver.reload()),
      ))
    )
  ).pipe(
    shareReplay(1),
  );

  totals$ = this.job$.pipe(pluck('totals'));

  canDeactivate(): Observable<boolean> | boolean {
    return this.form.pristine;
  }

  onSetAsActive(pasutijums: number) {
    this.prefService.updateUserPreferences({ pasutijums })
      .subscribe();
  }

}
