import { Directive, computed, model } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';

@Directive({
  selector: '[appProductsSort]',
  standalone: true,
  hostDirectives: [
    {
      directive: MatSort,
      inputs: ['matSortActive', 'matSortDirection', 'matSortDisableClear'],
      outputs: ['matSortChange'],
    },
  ],
  host: {
    '[matSortActive]': 'sort().active',
    '[matSortDirection]': 'sort().direction',
    '(matSortChange)': 'onSortChange($event)',
  },
})
export class ProductsSortDirective {
  sortString = model('name,1');

  sort = computed(() => this.stringToSort(this.sortString()));

  onSortChange(event: Sort) {
    const sortString = this.sortToString(event);
    this.sortString.set(sortString);
  }

  private sortToString({ active, direction }: Sort): string {
    let dir: -1 | 1 = 1;
    if (direction === 'asc') {
      dir = 1;
    }
    if (direction === 'desc') {
      dir = -1;
    }
    return [active, dir].join(',');
  }

  private stringToSort(str: string): Sort {
    const [active, dir] = str.split(',');
    return {
      active,
      direction: dir === '-1' ? 'desc' : 'asc',
    };
  }
}
