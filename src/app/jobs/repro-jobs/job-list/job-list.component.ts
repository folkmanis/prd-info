import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { isEqual } from 'lodash-es';
import { EMPTY, from } from 'rxjs';
import { navigateRelative } from 'src/app/library/navigation';
import { NotificationsService } from 'src/app/services';
import { ProductsService } from 'src/app/services/products.service';
import { ScrollTopDirective } from '../../../library/scroll-to-top/scroll-top.directive';
import { DrawerButtonDirective } from '../../../library/side-button/drawer-button.directive';
import { JobFilter } from '../../interfaces';
import { JobFilterComponent } from '../job-filter/job-filter.component';
import { ProductsSummaryComponent } from '../products-summary/products-summary.component';
import { PartialJob, ReproJobService } from '../services/repro-job.service';
import { UploadRefService } from '../services/upload-ref.service';
import { JobTableComponent } from './job-table/job-table.component';
import { NewJobButtonComponent } from './new-job-button/new-job-button.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSidenavModule, DrawerButtonDirective, ProductsSummaryComponent, NewJobButtonComponent, JobFilterComponent, ScrollTopDirective, MatProgressBar, JobTableComponent],
})
export class JobListComponent {
  #router = inject(Router);
  #uploadRefService = inject(UploadRefService);
  #reproJobService = inject(ReproJobService);

  #notifications$ = inject(NotificationsService).wsMultiplex('jobs');

  #navigate = navigateRelative();

  filter = input.required<JobFilter>();
  #filterChanges = computed(() => this.filter(), { equal: isEqual });

  jobsRef = this.#reproJobService.getJobsResource(this.#filterChanges);

  activeProducts = inject(ProductsService).getProductsResource({ disabled: false }).asReadonly();

  highlited: string | null = null;

  constructor() {
    effect((onCleanup) => {
      const subs = this.#notifications$.subscribe(() => {
        this.jobsRef.reload();
      });
      onCleanup(() => subs.unsubscribe());
    });
  }

  onJobFilter(filter: JobFilter) {
    this.#navigate(['.'], { queryParams: filter });
  }

  async onUpdateJob(jobUpdate: PartialJob) {
    if (this.jobsRef.hasValue()) {
      this.jobsRef.update((jobs) => jobs.map((job) => (job.jobId === jobUpdate.jobId ? { ...job, ...jobUpdate } : job)));
    }
    await this.#reproJobService.updateJob(jobUpdate);
    this.jobsRef.reload();
  }

  onFileDrop(fileList: FileList) {
    const name = this.#reproJobService.jobNameFromFiles(Array.from(fileList).map((file) => file.name));
    const sortedFiles = Array.from(fileList).sort((a, b) => a.size - b.size);

    this.#uploadRefService.setUserFile(from(sortedFiles), EMPTY);

    this.#reproJobService.setJobTemplate({ name });

    this.#router.navigate(['jobs', 'repro', 'new']);
  }
}
