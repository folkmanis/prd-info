import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { EMPTY, from, map, of, shareReplay, Subject, switchMap } from 'rxjs';
import { combineReload } from 'src/app/library/rxjs';
import { NotificationsService } from 'src/app/services';
import { DrawerButtonDirective } from '../../../library/side-button/drawer-button.directive';
import { JobFilter } from '../../interfaces';
import { JobListService } from '../../services/job-list.service';
import { ProductsSummaryComponent } from '../products-summary/products-summary.component';
import { PartialJob, ReproJobService } from '../services/repro-job.service';
import { UploadRefService } from '../services/upload-ref.service';
import { JobTableComponent } from './job-table/job-table.component';
import { NewJobButtonComponent } from './new-job-button/new-job-button.component';

const DEFAULT_FILTER: JobFilter = {
  jobStatus: [10, 20],
};

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    DrawerButtonDirective,
    ProductsSummaryComponent,
    NewJobButtonComponent,
    JobTableComponent,
    AsyncPipe,
  ],
})
export class JobListComponent {
  #router = inject(Router);
  #uploadRefService = inject(UploadRefService);
  #reproJobService = inject(ReproJobService);

  #jobListService = inject(JobListService);

  #notifications$ = inject(NotificationsService)
    .wsMultiplex('jobs')
    .pipe(map(() => undefined));
  #reload$ = new Subject<void>();

  readonly #filter$ = combineReload(of(DEFAULT_FILTER), this.#notifications$, this.#reload$).pipe(shareReplay());

  protected data$ = this.#jobListService.getData(this.#filter$);

  protected productsSummary$ = this.#filter$.pipe(switchMap((filter) => this.#jobListService.productsSummary(filter)));

  highlited: string | null = null;

  async onUpdateJob(jobUpdate: PartialJob) {
    await this.#reproJobService.updateJob(jobUpdate);
    this.#reload$.next();
  }

  onFileDrop(fileList: FileList) {
    const name = this.#reproJobService.jobNameFromFiles(Array.from(fileList).map((file) => file.name));
    const sortedFiles = Array.from(fileList).sort((a, b) => a.size - b.size);

    this.#uploadRefService.setUserFile(from(sortedFiles), EMPTY);

    this.#reproJobService.setJobTemplate({ name });

    this.#router.navigate(['jobs', 'repro', 'new']);
  }
}
