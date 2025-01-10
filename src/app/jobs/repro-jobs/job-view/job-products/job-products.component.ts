import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { JobProduct } from 'src/app/jobs/interfaces';
import { IfViewSizeDirective } from 'src/app/library/view-size';
import { JobProductsLargeComponent } from './job-products-large/job-products-large.component';
import { JobProductsSmallComponent } from './job-products-small/job-products-small.component';

@Component({
  selector: 'app-job-products',
  imports: [JobProductsLargeComponent, JobProductsSmallComponent, IfViewSizeDirective],
  templateUrl: './job-products.component.html',
  styleUrl: './job-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobProductsComponent {
  products = input<JobProduct[]>([]);
  showPrices = input(false);

  jobTotal = computed(() => this.products().reduce((acc, product) => acc + product.count * product.price, 0));
  jobCount = computed(() => this.products().reduce((acc, product) => acc + product.count, 0));
}
