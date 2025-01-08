import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { JobProduct } from 'src/app/jobs/interfaces';

@Component({
  selector: 'app-job-product',
  imports: [CurrencyPipe],
  templateUrl: './job-product.component.html',
  styleUrl: './job-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobProductComponent {
  jobProduct = input.required<JobProduct>();
  total = computed(() => this.jobProduct().price * this.jobProduct().count);

  showPrices = input(false);
}
