import { SelectionModel } from '@angular/cdk/collections';
import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Job } from 'src/app/jobs';
import { ViewSizeDirective } from 'src/app/library';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { COLUMNS, COLUMNS_SMALL, JobData, JobWithUpdate } from '../interfaces';

@Component({
  selector: 'app-job-prices-table',
  standalone: true,
  templateUrl: './job-prices-table.component.html',
  styleUrls: ['./job-prices-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, ScrollTopDirective, MatCheckboxModule, MatButtonModule, MatIconModule, RouterLink, CurrencyPipe, ViewSizeDirective],
  hostDirectives: [ScrollTopDirective],
})
export class JobPricesTableComponent {
  jobs = input([] as JobData[]);

  selection = new SelectionModel<JobData>(true, [], true);

  jobChange = outputFromObservable(
    this.selection.changed.pipe(
      map((changes) => changes.source.selected),
      map((selected) => this.jobUpdateFields(selected)),
    ),
  );

  trackByFn = (_: number, item: JobData) => `${item.jobId}-${item.productsIdx}`;

  col = COLUMNS;
  colSmall = COLUMNS_SMALL;

  constructor() {
    effect(() => {
      this.jobs() && this.selection.clear();
    });
  }

  private jobUpdateFields(jobs: Pick<JobWithUpdate, 'jobId' | 'productsIdx' | 'products.priceUpdate'>[]): Partial<Job>[] {
    return jobs.map((job) => ({
      jobId: job.jobId,
      [`products.${job.productsIdx}.price`]: job['products.priceUpdate'],
    }));
  }
}
