import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { JobProduct, JobsProduction, JobsProductionQuery, JobPartial } from '../../interfaces';
import { ReplaySubject } from 'rxjs';

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

    if (value) {
      this.productSums = this.productsSummary(value);
    }
  }


  private productsSummary(jobs: JobPartial[]): ProductSum[] {

    const products = jobs.reduce((acc, curr) => [...acc, ...curr.products], []);
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
