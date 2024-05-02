import { SelectionModel } from '@angular/cdk/collections';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
} from '@angular/core';
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
  imports: [
    MatTableModule,
    ScrollTopDirective,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CurrencyPipe,
    AsyncPipe,
    ViewSizeDirective,
  ],
})
export class JobPricesTableComponent {
  private _jobs: JobData[] = [];
  @Input()
  set jobs(value: JobData[]) {
    this._jobs = value;
    this.selection.clear();
  }
  get jobs() {
    return this._jobs;
  }

  selection = new SelectionModel<JobData>(true, [], true);

  @Output() jobChanges = this.selection.changed.pipe(
    map((changes) => changes.source.selected),
    map((selected) => this.jobUpdateFields(selected))
  );

  trackByFn = (_: number, item: JobData) => `${item.jobId}-${item.productsIdx}`;

  col = COLUMNS;
  colSmall = COLUMNS_SMALL;

  private jobUpdateFields(
    jobs: Pick<
      JobWithUpdate,
      'jobId' | 'productsIdx' | 'products.priceUpdate'
    >[]
  ): Partial<Job>[] {
    return jobs.map((job) => ({
      jobId: job.jobId,
      [`products.${job.productsIdx}.price`]: job['products.priceUpdate'],
    }));
  }
}
