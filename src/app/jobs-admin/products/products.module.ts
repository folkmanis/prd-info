import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from 'src/app/library/library.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductPricesComponent } from './products-editor/product-prices/product-prices.component';
import { ProductsResolverService } from './services/products-resolver.service';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsEditorComponent } from './products-editor/products-editor.component';
import { ProductFormService } from './services/product-form.service';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductPricesComponent,
    ProductsListComponent,
    ProductsEditorComponent
  ],
  imports: [
    CommonModule,
    LibraryModule,
    ProductsRoutingModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    ProductsResolverService,
    ProductFormService,
  ]
})
export class ProductsModule { }
