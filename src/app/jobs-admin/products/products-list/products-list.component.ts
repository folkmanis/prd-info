import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout/layout.service';
import { ProductsService } from 'src/app/services';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent implements OnInit {


  constructor(
    private productsService: ProductsService,
    private layout: LayoutService,
  ) { }
  large$ = this.layout.isLarge$;

  displayedColumns = ['name', 'category'];

  private filter = new BehaviorSubject('');

  products$ = combineLatest([
    this.filter.pipe(
      debounceTime(200),
      map(str => str.toUpperCase()),
    ),
    this.productsService.products$
  ]).pipe(
    map(([str, prod]) => prod.filter(pr => pr.name.toUpperCase().includes(str))),
  );

  ngOnInit(): void {
  }

  onFilter(value: string) {
    this.filter.next(value);
  }

}
