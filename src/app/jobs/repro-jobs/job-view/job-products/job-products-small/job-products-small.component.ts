import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { JobProduct } from 'src/app/jobs/interfaces';

@Component({
  selector: 'app-job-products-small',
  imports: [CurrencyPipe, MatDivider],
  templateUrl: './job-products-small.component.html',
  styleUrl: './job-products-small.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobProductsSmallComponent {
  products = input<JobProduct[]>([]);
  showPrices = input(false);

  jobTotal = input(0);
  jobCount = input(0);
}
