import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from 'src/app/library/library.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { EditComponent } from './edit/edit.component';
import { ProductPricesComponent } from './product-prices/product-prices.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductsResolverService } from './services/products-resolver.service';
import { ProductsListComponent } from './products-list/products-list.component';


@NgModule({
  declarations: [
    ProductsComponent,
    EditComponent,
    ProductPricesComponent,
    ProductFormComponent,
    ProductsListComponent
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
