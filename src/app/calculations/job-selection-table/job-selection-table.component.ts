import { CurrencyPipe, DatePipe } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { JobUnwinded } from 'src/app/jobs/interfaces/job-unwinded';
import { RouterLinkWithReturnDirective } from 'src/app/library/navigation';
import { z } from 'zod';

const TABLE_COLUMNS = ['selected', 'jobId', 'receivedDate', 'custCode', 'name', 'productName', 'count', 'price', 'total'];

export const JobSelectionTableDataScheme = JobUnwinded.pick({
  jobId: true,
  receivedDate: true,
  products: true,
  name: true,
}).partial({ products: true });
export type JobSelectionTableData = z.infer<typeof JobSelectionTableDataScheme>;

@Component({
  selector: 'app-job-selection-table',
  templateUrl: './job-selection-table.component.html',
  styleUrls: ['./job-selection-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatCheckboxModule, DatePipe, CurrencyPipe, MatButtonModule, RouterLinkWithReturnDirective],
})
export class JobSelectionTableComponent<D extends JobSelectionTableData> {
  selected = input<D[]>([] as D[]);
  selectedChange = output<D[]>();

  selectedUniqueIds = computed(() => this.toUniqueIds(this.selected()));

  isAllSelected = computed(() => this.uniqueJobIds().length > 0 && this.uniqueJobIds().length === this.selectedUniqueIds().length);
  isSelection = computed(() => this.selectedUniqueIds().length > 0);

  jobs = input.required<D[]>();
  uniqueJobIds = computed(() => this.toUniqueIds(this.jobs()));

  disabled = input(false, { transform: booleanAttribute });
  large = input(false, { transform: booleanAttribute });
  total = input(null as number | null);

  displayedColumns = computed(() => this.setDisplayedColumns(this.disabled(), this.large()));

  isNumber = (value: any) => !isNaN(value);

  toggleAll() {
    this.isAllSelected() ? this.deselectAll() : this.selectAll();
  }

  selectAll(): void {
    this.emitJobs(this.uniqueJobIds());
  }

  deselectAll(): void {
    this.emitJobs([]);
  }

  toggle(jobId: number) {
    const selection = this.selectedUniqueIds();
    const selected = selection.includes(jobId) ? selection.filter((id) => id !== jobId) : [...selection, jobId];
    this.emitJobs(selected);
  }

  private emitJobs(jobIds: number[]) {
    const selected = this.jobs().filter((job) => jobIds.includes(job.jobId));
    this.selectedChange.emit(selected);
  }

  private setDisplayedColumns(disabled: boolean, large: boolean) {
    const cols = disabled ? TABLE_COLUMNS.filter((col) => col !== 'selected') : TABLE_COLUMNS;
    return large ? cols : cols.filter((col) => ['selected', 'jobId', 'customer', 'name', 'total'].includes(col));
  }

  private toUniqueIds(jobs: D[]): number[] {
    const ids = jobs.map((job) => job.jobId);
    const uniqueIds = [...new Set(ids)];
    return uniqueIds;
  }
}
