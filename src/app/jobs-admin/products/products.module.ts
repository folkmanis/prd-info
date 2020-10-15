import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from 'src/app/library/library.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { EditComponent } from './edit/edit.component';
import { ProductPricesComponent } from './edit/product-prices/product-prices.component';
import { ProductFormService } from './services/product-form.service';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductsResolverService } from './services/products-resolver.service';


@NgModule({
  declarations: [
    ProductsComponent,
    EditComponent,
    ProductPricesComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    LibraryModule,
    ProductsRoutingModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    ProductsResolverService,
  ]
})
export class ProductsModule { }
