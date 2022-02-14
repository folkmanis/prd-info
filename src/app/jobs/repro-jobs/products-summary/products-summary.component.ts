import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JobPartial } from '../../interfaces';

interface ProductSum {
  name: string;
  count: number;
  units: string;
}

@Component({
  selector: 'app-products-summary',
  templateUrl: './products-summary.component.html',
  styleUrls: ['./products-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsSummaryComponent {

  productSums: ProductSum[] = [];

  @Input() set jobs(value: JobPartial[]) {
    this.productSums = this.productsSummary(value);
  }


  private productsSummary(jobs: JobPartial[] | undefined): ProductSum[] {

    const products = jobs
      ?.filter(job => job.products instanceof Array)
      .reduce((acc, curr) => [...acc, ...curr.products], []) || [];
    const productMap = new Map<string, ProductSum>();

    for (const product of products) {
      const { name, units, count } = product;
      const oldCount = productMap.get(name)?.count || 0;
      productMap.set(
        name,
        {
          name,
          units,
          count: oldCount + count,
        }
      );
    }

    return [...productMap.values()]
      .sort((a, b) => a.name > b.name ? 1 : -1);

  }


}
