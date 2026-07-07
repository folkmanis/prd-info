import { Component, model } from '@angular/core';
import { debounce, form, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { configuration } from 'src/app/services/config.provider';

export type MaterialsFilterModel = {
  name: string;
  categories: string[];
};

@Component({
  selector: 'app-materials-filter',
  templateUrl: './materials-filter.component.html',
  styleUrls: ['./materials-filter.component.scss'],
  imports: [FormField, MatFormFieldModule, MatIcon, MatOptionModule, MatInputModule, MatSelectModule, MatButtonModule],
})
export class MaterialsFilterComponent {
  filter = model.required<MaterialsFilterModel>();
  protected filterForm = form(this.filter, (schema) => {
    debounce(schema.name, 300);
  });

  protected categories = configuration('jobs', 'productCategories');

  protected onClear() {
    this.filterForm().reset({
      name: '',
      categories: [],
    });
  }
}
