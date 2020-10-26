import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { IFormControl } from '@rxweb/types';
import { ProductsService } from 'src/app/services';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  searchControl: IFormControl<string> = new FormControl('');

  constructor(
    private productsService: ProductsService,
  ) { }

  displayedColumns = ['name', 'category', 'inactive'];

  products$ = combineLatest([
    this.searchControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      startWith(''),
      map(str => str.toUpperCase()),
    ),
    this.productsService.products$
  ]).pipe(
    map(([str, prod]) => prod.filter(pr => pr.name.toUpperCase().includes(str))),
  );

  ngOnInit(): void {
  }

}
