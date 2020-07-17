import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from 'src/app/library/library.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { EditComponent } from './edit/edit.component';
import { NewComponent } from './new/new.component';
import { ProductPricesComponent } from './edit/product-prices/product-prices.component';
import { FormArrayForOfDirective } from './form-array-for-of.directive';


@NgModule({
  declarations: [ProductsComponent, EditComponent, NewComponent, ProductPricesComponent, FormArrayForOfDirective],
  imports: [
    CommonModule,
    LibraryModule,
    ProductsRoutingModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ]
})
export class ProductsModule { }
