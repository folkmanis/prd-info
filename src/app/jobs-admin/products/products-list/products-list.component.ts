import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ProductsService } from 'src/app/services';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { MatTable, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductPartial } from 'src/app/interfaces';

@Component({
  selector: 'app-products-list',
  standalone: true,
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SimpleListContainerComponent,
    MatTableModule,
    RouterLink,
    RouterLinkActive,
  ],
})
export class ProductsListComponent {

  private productsService = inject(ProductsService);
  private allProducts = this.productsService.products;

  private filter = computed(() => this.name()?.trim().toLowerCase() || '');

  displayedColumns = ['name', 'category'];

  name = signal('');

  products = computed(() => {
    const filter = this.filter();
    return this.allProducts().filter(product => product.name.toLowerCase().includes(filter));
  });

  async reload() {
    this.productsService.reload();
  }


}
