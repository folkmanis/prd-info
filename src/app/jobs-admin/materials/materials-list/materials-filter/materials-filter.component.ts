import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, debounceTime, map } from 'rxjs';
import { getConfig } from 'src/app/services/config.provider';

import { AsyncPipe } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ViewSizeModule } from 'src/app/library/view-size/view-size.module';
import { MaterialsFilter } from '../../services/materials.service';

const NO_FILTER: MaterialsFilter = {
  name: '',
  categories: [],
};

type MaterialsFilterType = {
  [K in keyof MaterialsFilter]: FormControl<MaterialsFilter[K]>;
};

@Component({
  selector: 'app-materials-filter',
  templateUrl: './materials-filter.component.html',
  styleUrls: ['./materials-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    ViewSizeModule,
    AsyncPipe,
    MatOptionModule,
    MatInputModule,
  ],
})
export class MaterialsFilterComponent implements OnInit {
  categories$ = getConfig('jobs', 'productCategories');

  filterGroup = new FormGroup<MaterialsFilterType>({
    name: new FormControl(''),
    categories: new FormControl([]),
  });

  @Output() filter: Observable<MaterialsFilter> =
    this.filterGroup.valueChanges.pipe(
      debounceTime(200),
      map((fltr) => this.processFilter(fltr))
    );

  ngOnInit(): void {}

  clear() {
    this.filterGroup.setValue(NO_FILTER);
  }

  private processFilter({
    name,
    categories,
  }: MaterialsFilter): MaterialsFilter {
    return {
      name: name?.trim() || undefined,
      categories: categories?.length > 0 ? categories : undefined,
    };
  }
}
