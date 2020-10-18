import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  constructor(
    private productsService: ProductsService,
  ) { }

  displayedColumns = ['name', 'category', 'inactive'];

  products$ = this.productsService.products$;

  ngOnInit(): void {
  }

}
