import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Job, JobService, JobsWithoutInvoicesTotals } from 'src/app/jobs';
import { CustomerSelectorComponent } from './customer-selector/customer-selector.component';
import { JobPricesTableComponent } from './job-prices-table/job-prices-table.component';
import { JobData } from './interfaces';

const updateMessage = (n: number) => `Izmainīti ${n} ieraksti.`;

@Component({
  selector: 'app-job-prices',
  standalone: true,
  templateUrl: './job-prices.component.html',
  styleUrls: ['./job-prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CustomerSelectorComponent, MatButtonModule, MatBadgeModule, MatCardModule, JobPricesTableComponent],
})
export class JobPricesComponent {
  @Input()
  customer: string;

  @Input()
  jobs: JobData[] = [];

  @Input()
  customers: JobsWithoutInvoicesTotals[] = [];

  jobUpdate = signal<Partial<Job>[]>([]);

  saveEnabled = computed(() => this.jobUpdate().length > 0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private jobService: JobService,
  ) {}

  onCustomerSelected(value: string | undefined) {
    this.router.navigate([], { queryParams: { customer: value }, relativeTo: this.route });
  }

  onJobsSelected(value: Partial<Job>[]) {
    this.jobUpdate.set(value);
  }

  onSavePrices() {
    this.jobService.updateJobs(this.jobUpdate()).subscribe((updatedCount) => {
      this.snack.open(updateMessage(updatedCount), 'OK', { duration: 3000 });
      this.router.navigate([], { queryParams: { customer: this.customer, upd: Date.now() }, relativeTo: this.route });
    });
  }
}
