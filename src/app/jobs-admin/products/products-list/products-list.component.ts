import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { debounce, form, FormField } from '@angular/forms/signals';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isEqual } from 'lodash-es';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { ProductsService } from 'src/app/services';
import { ProductsFilter } from 'src/app/services/prd-api/products-api.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SimpleListContainerComponent,
    MatTableModule,
    RouterLink,
    RouterLinkActive,
    MatFormFieldModule,
    MatInput,
    MatIconButton,
    MatIcon,
    FormField,
  ],
})
export class ProductsListComponent {
  private productsService = inject(ProductsService);

  private readonly filter = computed<ProductsFilter | undefined>(
    () => {
      const name = this.#filterModel().name;
      if (name) {
        return { name };
      } else {
        return;
      }
    },
    { equal: isEqual },
  );

  #filterModel = signal({ name: '' });
  protected filterForm = form(this.#filterModel, (s) => {
    debounce(s.name, 300);
  });

  products = this.productsService.getProductsResource(this.filter);

  displayedColumns = ['name', 'category'];

  onReload() {
    this.products.reload();
  }
}
