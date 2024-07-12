import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { formatISO, parseISO } from 'date-fns';
import { isEqual } from 'lodash-es';
import { DateUtilsService } from 'src/app/library/date-services';
import { configuration } from 'src/app/services/config.provider';
import { ViewSizeModule } from '../../../library/view-size/view-size.module';
import { JobsProductionFilterQuery } from '../../interfaces';
import { FilterSummaryComponent } from './filter-summary/filter-summary.component';

export const REPRO_DEFAULTS = {
  jobStatus: [10, 20],
  category: ['repro'],
  interval: {
    fromDate: null,
    toDate: null,
  },
};

interface NullableInterval {
  start: Date | null;
  end: Date | null;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatExpansionModule,
    ViewSizeModule,
    FilterSummaryComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class FilterComponent {
  private dateUtils = inject(DateUtilsService);

  filter = input<JobsProductionFilterQuery | null>(null);

  jobStates = configuration('jobs', 'jobStates');

  categories = configuration('jobs', 'productCategories');

  disabled = input(false);

  jobStatus = signal<number[]>([10, 20], { equal: isEqual });
  category = signal<string[]>(['repro'], { equal: isEqual });
  interval = signal<{ fromDate: Date | null; toDate: Date | null }>(
    {
      fromDate: null,
      toDate: null,
    },
    { equal: isEqual },
  );

  query = computed<JobsProductionFilterQuery>(() => {
    const fromDate = this.interval().fromDate;
    const toDate = this.interval().toDate;
    const jobStatus = this.jobStatus();
    const category = this.category();
    return {
      fromDate: fromDate && formatISO(fromDate, { representation: 'date' }),
      toDate: toDate && formatISO(toDate, { representation: 'date' }),
      jobStatus: jobStatus.length > 0 ? jobStatus : undefined,
      category: category.length > 0 ? category : undefined,
    };
  });

  filterChange = output<JobsProductionFilterQuery>();

  constructor() {
    effect(
      () => {
        this.writeValue(this.filter());
      },
      { allowSignalWrites: true },
    );
  }

  onChangeJobStatus(value: number[]) {
    this.jobStatus.set(value);
    this.filterChange.emit(this.query());
  }

  onChangeCategory(value: string[]) {
    this.category.set(value);
    this.filterChange.emit(this.query());
  }

  onChangeFromDate(event: MatDatepickerInputEvent<Date>) {
    this.interval.update((value) => ({ ...value, fromDate: event.value }));
    this.filterChange.emit(this.query());
  }

  onChangeToDate(event: MatDatepickerInputEvent<Date>) {
    this.interval.update((value) => ({ ...value, toDate: event.value }));
    this.filterChange.emit(this.query());
  }

  onSetRepro() {
    this.jobStatus.set(REPRO_DEFAULTS.jobStatus);
    this.category.set(REPRO_DEFAULTS.category);
    this.interval.set(REPRO_DEFAULTS.interval);
    this.filterChange.emit(this.query());
  }

  onThisWeek() {
    this.setInterval(this.dateUtils.thisWeek());
  }

  onThisYear() {
    this.setInterval(this.dateUtils.thisYear());
  }

  onThisMonth() {
    this.setInterval(this.dateUtils.thisMonth());
  }

  onPastYear() {
    this.setInterval(this.dateUtils.pastYear());
  }

  private setInterval({ start, end }: NullableInterval) {
    this.interval.set({
      fromDate: start,
      toDate: end,
    });
    this.filterChange.emit(this.query());
  }

  private writeValue(value: JobsProductionFilterQuery | null): void {
    if (value) {
      const { fromDate, toDate, jobStatus, category } = value;
      this.jobStatus.set(jobStatus || []);
      this.category.set(category || []);
      this.interval.set({
        fromDate: fromDate ? parseISO(fromDate) : null,
        toDate: toDate ? parseISO(toDate) : null,
      });
    }
  }
}
