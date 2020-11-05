import { Component, OnInit } from '@angular/core';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { IFormControl } from '@rxweb/types';
import { ProductsService } from 'src/app/services';
import { LayoutService } from 'src/app/layout/layout.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {


  constructor(
    private productsService: ProductsService,
    private layout: LayoutService,
  ) { }
  large$ = this.layout.isLarge$;

  displayedColumns = ['name', 'category', 'inactive'];

  private filter = new BehaviorSubject('');

  products$ = combineLatest([
    this.filter.pipe(
      debounceTime(200),
      // distinctUntilChanged(),
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
