import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Job, JobService, JobsWithoutInvoicesTotals } from 'src/app/jobs';
import { navigateRelative } from 'src/app/library/navigation';
import { CustomerSelectorComponent } from './customer-selector/customer-selector.component';
import { JobData } from './interfaces';
import { JobPricesTableComponent } from './job-prices-table/job-prices-table.component';

const updateMessage = (n: number) => `Izmainīti ${n} ieraksti.`;

@Component({
    selector: 'app-job-prices',
    templateUrl: './job-prices.component.html',
    styleUrls: ['./job-prices.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CustomerSelectorComponent, MatButtonModule, MatBadgeModule, MatCardModule, JobPricesTableComponent]
})
export class JobPricesComponent {
  private snack = inject(MatSnackBar);
  private jobService = inject(JobService);
  private navigate = navigateRelative();

  customer = input<string>();
  customerWithDefault = computed(() => this.customer() ?? '');

  jobs = input([] as JobData[]);

  customers = input([] as JobsWithoutInvoicesTotals[]);

  jobUpdate = signal<Partial<Job>[]>([]);

  saveEnabled = computed(() => this.jobUpdate().length > 0);

  onCustomerSelected(value: string) {
    this.navigate([], { queryParams: { customer: value || undefined } });
  }

  onJobsSelected(value: Partial<Job>[]) {
    this.jobUpdate.set(value);
  }

  async onSavePrices() {
    const updatedCount = await this.jobService.updateJobs(this.jobUpdate());
    this.snack.open(updateMessage(updatedCount), 'OK', { duration: 3000 });
    await this.navigate([], { queryParams: { customer: this.customer(), upd: Date.now() } });
  }
}
