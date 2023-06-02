import { Directive, Input, Output } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive({
    selector: '[appProductsSort]',
    providers: [{ provide: MatSort, useExisting: ProductsSortDirective }],
    standalone: true
})
export class ProductsSortDirective extends MatSort {

  @Output()
  sortStringChange: Observable<string> = this.sortChange.pipe(
    map(sort => this.sortToString(sort)),
  );

  @Input('activeSortString')
  set activeString(str: string) {
    if (typeof str !== 'string') {
      return;
    }
    const { active, direction } = this.stringToSort(str);
    if (this.sortables.has(active)) {
      this.active = active;
      this.direction = direction;
      this._stateChanges.next();
    }
  }
  get activeString(): string {
    return this.sortToString({
      active: this.active,
      direction: this.direction,
    });
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
