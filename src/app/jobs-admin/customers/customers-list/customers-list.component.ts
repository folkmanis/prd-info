import { Component, computed, inject, signal } from '@angular/core';
import { debounce, form, FormField } from '@angular/forms/signals';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isEqual } from 'lodash-es';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { CustomersQuerySchema, CustomersService } from 'src/app/services';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
  imports: [
    MatTableModule,
    RouterLink,
    RouterLinkActive,
    SimpleListContainerComponent,
    MatFormFieldModule,
    MatInput,
    MatIcon,
    MatIconButton,
    FormField,
  ],
})
export class CustomersListComponent {
  #customersService = inject(CustomersService);
  protected displayedColumns = ['customerName'];

  #searchModel = signal({ name: '' });
  protected searchForm = form(this.#searchModel, (schema) => {
    debounce(schema.name, 300);
  });

  #filter = computed(
    () => {
      const filter = CustomersQuerySchema.decode(this.#searchModel());
      return { ...filter, disabled: true };
    },
    { equal: isEqual },
  );

  protected customers = this.#customersService.getCustomersResource(this.#filter);

  onReload() {
    this.customers.reload();
  }
}
