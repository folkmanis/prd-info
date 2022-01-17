import { Component, OnInit, Output, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, pluck } from 'rxjs/operators';
import { SystemPreferences } from 'src/app/interfaces';
import { LayoutService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';

import { MaterialsFilter } from '../../services/materials.service';

const NO_FILTER: MaterialsFilter = {
  name: '',
  categories: [],
};

@Component({
  selector: 'app-materials-filter',
  templateUrl: './materials-filter.component.html',
  styleUrls: ['./materials-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsFilterComponent implements OnInit {

  categories$ = this.config$.pipe(pluck('jobs', 'productCategories'));
  large$ = this.layout.isLarge$;

  filterGroup = new FormGroup({
    name: new FormControl(''),
    categories: new FormControl([])
  });

  get nameControl(): FormControl { return this.filterGroup.get('name') as FormControl; }
  get categoriesControl(): FormControl { return this.filterGroup.get('categories') as FormControl; }

  @Output() filter: Observable<MaterialsFilter> = this.filterGroup.valueChanges.pipe(
    debounceTime(200),
    map(fltr => this.processFilter(fltr)),
  );

  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private layout: LayoutService,
  ) { }

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
