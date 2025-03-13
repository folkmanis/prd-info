import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal } from '@angular/core';
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
  imports: [SimpleListContainerComponent, MatTableModule, RouterLink, RouterLinkActive],
})
export class ProductsListComponent {
  private productsService = inject(ProductsService);

  private readonly filter = linkedSignal<ProductsFilter>(
    () => {
      const filter: ProductsFilter = {};
      if (this.name()) {
        filter.name = this.name();
      }
      return filter;
    },
    { equal: isEqual },
  );

  name = signal('');

  products = this.productsService.getProductsResource(this.filter);

  displayedColumns = ['name', 'category'];

  onReload() {
    this.products.reload();
  }
}
