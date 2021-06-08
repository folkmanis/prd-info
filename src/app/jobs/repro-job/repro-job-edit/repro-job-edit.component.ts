import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGroup } from '@rxweb/types';
import { DestroyService } from 'prd-cdk';
import { merge, Observable, Subject } from 'rxjs';
import { map, pluck, switchMap, takeUntil } from 'rxjs/operators';
import { JobBase } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { JobFormService } from '../services/job-form.service';
import { ReproJobService } from '../services/repro-job.service';
import { ReproJobFormComponent } from './repro-job-form/repro-job-form.component';


@Component({
  selector: 'app-repro-job-edit',
  templateUrl: './repro-job-edit.component.html',
  styleUrls: ['./repro-job-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class ReproJobEditComponent implements OnInit, CanComponentDeactivate {

  @ViewChild(ReproJobFormComponent) private jobFormComponent: ReproJobFormComponent;

  form: IFormGroup<JobBase> = this.jobFormService.createJobForm();

  reload$ = new Subject<void>();

  private readonly job$: Observable<Partial<JobBase>> = merge(
    this.route.data.pipe(pluck('job')),
    this.reload$.pipe(
      switchMap(_ => this.reproJobService.reload())
    )
  ).pipe(
    map(job => this.setJobDefaults(job)),
  );

  get isNew(): boolean {
    return !this.form.value.jobId;
  }

  constructor(
    private jobFormService: JobFormService,
    private route: ActivatedRoute,
    private reproJobService: ReproJobService,
    private destroy$: DestroyService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.job$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(job => {
      this.jobFormService.initValue(this.form, job);
      if (!job.customer) {
        setTimeout(() => this.jobFormComponent.customerInput.focus(), 200);
      }
    });

  }

  onSave() {
    if (!this.form.valid || this.form.pristine) {
      return;
    }
    if (this.isNew) {
      this.reproJobService.insertJob(this.form.value)
        .subscribe(id => {
          this.form.markAsPristine();
          this.router.navigate(['..'], { relativeTo: this.route });
        });
    } else {
      this.reproJobService.updateJob(this.form.value)
        .subscribe(_ => {
          this.form.markAsPristine();
          this.router.navigate(['..'], { relativeTo: this.route });
        });
    }
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

  private setJobDefaults(job: Partial<JobBase>): Partial<JobBase> {
    return {
      ...job,
      receivedDate: job.receivedDate || new Date(),
      dueDate: job.dueDate || new Date(),
      jobStatus: {
        generalStatus: job.jobStatus?.generalStatus || 10
      }
    };
  }


}
