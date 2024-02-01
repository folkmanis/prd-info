import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ProductsService } from 'src/app/services';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { MatTable, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
export class ProductsListComponent implements OnInit {
  displayedColumns = ['name', 'category'];

  private filter = new BehaviorSubject('');

  products$ = combineLatest([
    this.filter.pipe(
      debounceTime(200),
      map((str) => str.toUpperCase())
    ),
    this.productsService.products$,
  ]).pipe(
    map(([str, prod]) =>
      prod.filter((pr) => pr.name.toUpperCase().includes(str))
    )
  );

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {}

  onFilter(value: string) {
    this.filter.next(value);
  }
}
