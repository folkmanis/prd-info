import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { formatISO, parseISO } from 'date-fns';
import { isEqual } from 'lodash-es';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { configuration } from 'src/app/services/config.provider';
import { JobsProductionFilterQuery } from '../../interfaces';
import { DateRangePickerComponent, NullableInterval } from 'src/app/library/date-range-picker';
import { FilterSummaryComponent } from './filter-summary/filter-summary.component';

export const REPRO_DEFAULTS = {
  jobStatus: [10, 20],
  category: ['repro'],
  interval: {
    start: null,
    end: null,
  },
};

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatExpansionModule,
    ViewSizeDirective,
    FilterSummaryComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    DateRangePickerComponent,
    FormsModule,
  ],
})
export class FilterComponent {
  filter = input<JobsProductionFilterQuery | null>(null);

  jobStates = configuration('jobs', 'jobStates');

  categories = configuration('jobs', 'productCategories');

  disabled = input(false);

  jobStatus = signal<number[]>([10, 20], { equal: isEqual });
  category = signal<string[]>(['repro'], { equal: isEqual });
  interval = signal<{ start: Date | null; end: Date | null }>(
    {
      start: null,
      end: null,
    },
    { equal: isEqual },
  );

  query = computed<JobsProductionFilterQuery>(() => {
    const fromDate = this.interval().start;
    const toDate = this.interval().end;
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
    effect(() => {
      this.writeValue(this.filter());
    });
  }

  onChangeJobStatus(value: number[]) {
    this.jobStatus.set(value);
    this.filterChange.emit(this.query());
  }

  onChangeCategory(value: string[]) {
    this.category.set(value);
    this.filterChange.emit(this.query());
  }

  onSetRepro() {
    this.jobStatus.set(REPRO_DEFAULTS.jobStatus);
    this.category.set(REPRO_DEFAULTS.category);
    this.interval.set(REPRO_DEFAULTS.interval);
    this.filterChange.emit(this.query());
  }

  setInterval({ start, end }: NullableInterval) {
    this.interval.set({
      start: start,
      end: end,
    });
    this.filterChange.emit(this.query());
  }

  private writeValue(value: JobsProductionFilterQuery | null): void {
    if (value) {
      const { fromDate, toDate, jobStatus, category } = value;
      this.jobStatus.set(jobStatus || []);
      this.category.set(category || []);
      this.interval.set({
        start: fromDate ? parseISO(fromDate) : null,
        end: toDate ? parseISO(toDate) : null,
      });
    }
  }
}
