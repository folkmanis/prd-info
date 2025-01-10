import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { ProductsService } from 'src/app/services';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SimpleListContainerComponent, MatTableModule, RouterLink, RouterLinkActive],
})
export class ProductsListComponent {
  private productsService = inject(ProductsService);
  private allProducts = this.productsService.products;

  private filter = computed(() => this.name()?.trim().toLowerCase() || '');

  displayedColumns = ['name', 'category'];

  name = signal('');

  products = computed(() => {
    const filter = this.filter();
    return this.allProducts().filter((product) => product.name.toLowerCase().includes(filter));
  });

  async reload() {
    this.productsService.reload();
  }
}
