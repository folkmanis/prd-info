import { Component, OnInit } from '@angular/core';
import { ProductsService } from './services/products.service';
import { RouteSelection } from 'src/app/library/find-select-route/find-select-route.module';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(
    private service: ProductsService,
  ) { }

  products$: Observable<RouteSelection[]> = this.service.products$.pipe(
    map(products => products.map(prod => ({
      title: prod.name,
      link: ['edit', { id: prod._id }],
    }))
    ),
    map(this.addNewEntry),
  );

  ngOnInit(): void {
  }

  private addNewEntry(rts: RouteSelection[]): RouteSelection[] {
    return rts.concat([{
      title: '> Jauna prece <',
      link: ['new'],
    }]);
  }

}
