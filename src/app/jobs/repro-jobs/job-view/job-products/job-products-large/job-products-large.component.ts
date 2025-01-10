import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { JobProduct } from 'src/app/jobs/interfaces';

const ALL_USERS_COLUMNS = ['name', 'count'];
const PRICE_COLUMNS = ['price', 'total'];

@Component({
  selector: 'app-job-products-large',
  imports: [CurrencyPipe, MatTableModule],
  templateUrl: './job-products-large.component.html',
  styleUrl: './job-products-large.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobProductsLargeComponent {
  products = input<JobProduct[]>([]);
  showPrices = input(false);

  jobTotal = input(0);
  jobCount = input(0);

  displayedColumns = computed(() => (this.showPrices() ? ALL_USERS_COLUMNS.concat(PRICE_COLUMNS) : ALL_USERS_COLUMNS));
}
