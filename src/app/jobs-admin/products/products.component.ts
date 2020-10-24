import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LayoutService } from 'src/app/layout/layout.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {

  constructor(
    private layout: LayoutService,
  ) { }

  large$ = this.layout.isLarge$;

  ngOnInit(): void {
  }

}
