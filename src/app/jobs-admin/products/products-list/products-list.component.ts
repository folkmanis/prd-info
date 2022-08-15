import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ProductsService } from 'src/app/services';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent implements OnInit {


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


  constructor(
    private productsService: ProductsService,
  ) { }


  ngOnInit(): void {
  }

  onFilter(value: string) {
    this.filter.next(value);
  }

}
