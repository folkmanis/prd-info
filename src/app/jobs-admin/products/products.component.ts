import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouteSelection } from 'src/app/library/find-select-route/find-select-route.module';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {

  constructor(
  ) { }



  ngOnInit(): void {
  }

}
