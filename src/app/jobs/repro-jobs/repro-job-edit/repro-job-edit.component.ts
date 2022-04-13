import { Input, Output, ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormControlStatus } from '@angular/forms';
import { addDays, subDays } from 'date-fns';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { CustomerPartial, SystemPreferences } from 'src/app/interfaces';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { LoginService } from 'src/app/login';
import { CustomersService, LayoutService, ProductsService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { FileUploadMessage, Job } from '../../interfaces';
import { JobService } from '../../services/job.service';
import { JobFormGroup } from '../services/job-form-group';
import { DestroyService, log } from 'prd-cdk';
import { ReproJobService } from '../services/repro-job.service';
import { MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig } from '@angular/material/snack-bar';


@Component({
  selector: 'app-repro-job-edit',
  templateUrl: './repro-job-edit.component.html',
  styleUrls: ['./repro-job-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService,
    JobFormGroup,
  ]
})
export class ReproJobEditComponent implements OnInit {

  job$: Observable<Job> = this.route.data.pipe(
    pluck('job'),
  );


  constructor(
    private route: ActivatedRoute,
    private destroy$: DestroyService,
    public form: JobFormGroup,
    private router: Router,
    private reproJobServcie: ReproJobService,
    private snack: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.job$.subscribe(job => this.form.patchValue(job));
  }

  onUpdate(jobUpdate: Partial<Job>) {
    console.log(jobUpdate);
    const jobId = this.form.value.jobId;
    this.reproJobServcie.updateJob({ jobId, ...jobUpdate })
      .subscribe({
        next: (job) => {
          this.snack.open(`Darbs ${job.jobId}-${job.name} saglabāts!`, 'OK');
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: () => this.snack.open(`Neizdevā saglabāt darbu.`, 'OK')
      });

  }

  onCreate(job: Partial<Job>) {
    console.log(job);
  }

}

