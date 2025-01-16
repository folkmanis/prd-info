import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

  displayedColumns = ['name', 'category'];

  name = this.productsService.name;

  products = this.productsService.productsResource;

  constructor() {
    this.name.set('');
  }
}
