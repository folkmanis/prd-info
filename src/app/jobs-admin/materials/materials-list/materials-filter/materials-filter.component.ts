import { ChangeDetectionStrategy, Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, debounceTime, map } from 'rxjs';
import { getConfig } from 'src/app/services/config.provider';

import { MaterialsFilter } from '../../services/materials.service';

const NO_FILTER: MaterialsFilter = {
  name: '',
  categories: [],
};

type MaterialsFilterType = {
  [K in keyof MaterialsFilter]: FormControl<MaterialsFilter[K]>
};

@Component({
  selector: 'app-materials-filter',
  templateUrl: './materials-filter.component.html',
  styleUrls: ['./materials-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsFilterComponent implements OnInit {

  categories$ = getConfig('jobs', 'productCategories');

  filterGroup = new FormGroup<MaterialsFilterType>({
    name: new FormControl(''),
    categories: new FormControl([]),
  });


  @Output() filter: Observable<MaterialsFilter> = this.filterGroup.valueChanges.pipe(
    debounceTime(200),
    map(fltr => this.processFilter(fltr)),
  );


  ngOnInit(): void {
  }

  clear() {
    this.filterGroup.setValue(NO_FILTER);
  }

  private processFilter({ name, categories }: MaterialsFilter): MaterialsFilter {
    return {
      name: name?.trim() || undefined,
      categories: categories?.length > 0 ? categories : undefined,
    };
  }


}
