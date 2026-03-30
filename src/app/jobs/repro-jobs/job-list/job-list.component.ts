import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { isEqual } from 'lodash-es';
import { EMPTY, from, map, Subject } from 'rxjs';
import { navigateRelative } from 'src/app/library/navigation';
import { combineReload } from 'src/app/library/rxjs';
import { NotificationsService } from 'src/app/services';
import { ProductsService } from 'src/app/services/products.service';
import { DrawerButtonDirective } from '../../../library/side-button/drawer-button.directive';
import { JobFilter } from '../../interfaces';
import { JobFilterComponent } from '../job-filter/job-filter.component';
import { ProductsSummaryComponent } from '../products-summary/products-summary.component';
import { ReproJobListService } from '../services/repro-job-list.service';
import { PartialJob, ReproJobService } from '../services/repro-job.service';
import { UploadRefService } from '../services/upload-ref.service';
import { JobTableComponent } from './job-table/job-table.component';
import { NewJobButtonComponent } from './new-job-button/new-job-button.component';

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
    JobFilterComponent,
    JobTableComponent,
    AsyncPipe,
  ],
})
export class JobListComponent {
  #router = inject(Router);
  #uploadRefService = inject(UploadRefService);
  #reproJobService = inject(ReproJobService);

  #jobListService = inject(ReproJobListService);

  #notifications$ = inject(NotificationsService)
    .wsMultiplex('jobs')
    .pipe(map(() => undefined));
  #reload$ = new Subject<void>();

  #navigate = navigateRelative();

  filter = input.required<JobFilter>();
  #filterChanges = computed(() => this.filter(), { equal: isEqual });

  data$ = this.#jobListService.getData(
    combineReload(toObservable(this.#filterChanges), this.#notifications$, this.#reload$),
  );

  activeProducts = inject(ProductsService).getProductsResource({ disabled: false }).asReadonly();

  protected productsSummary = this.#jobListService.productsSummaryResource(this.#filterChanges);

  highlited: string | null = null;

  onJobFilter(filter: JobFilter) {
    this.#navigate(['.'], { queryParams: filter });
  }

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
