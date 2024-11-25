import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, debounceTime, map } from 'rxjs';
import { IfViewSizeDirective } from 'src/app/library/view-size';
import { configuration } from 'src/app/services/config.provider';
import { MaterialsFilter } from '../../services/materials.service';

@Component({
  selector: 'app-materials-filter',
  templateUrl: './materials-filter.component.html',
  styleUrls: ['./materials-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatIcon, MatOptionModule, MatInputModule, IfViewSizeDirective, MatSelectModule, MatButtonModule],
})
export class MaterialsFilterComponent {
  filterGroup = inject(FormBuilder).nonNullable.group({
    name: [''],
    categories: [[] as string[]],
  });

  filter$: Observable<MaterialsFilter> = this.filterGroup.valueChanges.pipe(
    debounceTime(200),
    map(({ name, categories }) => {
      return {
        name: name?.trim() || undefined,
        categories: categories?.length > 0 ? categories : undefined,
      };
    }),
  );

  filter = input({} as MaterialsFilter);

  filterChange = outputFromObservable(this.filter$);

  categories = configuration('jobs', 'productCategories');

  constructor() {
    effect(() => {
      this.filterGroup.reset(this.filter(), { emitEvent: false });
    });
  }

  clear() {
    this.filterGroup.reset();
  }
}
