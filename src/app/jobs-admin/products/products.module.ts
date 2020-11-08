import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library/library.module';
import { SimpleFormModule } from 'src/app/library/simple-form';
import { ProductPricesComponent } from './products-editor/product-prices/product-prices.component';
import { ProductsEditorComponent } from './products-editor/products-editor.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsResolverService } from './services/products-resolver.service';
import { SimpleFormResolverService } from 'src/app/library/simple-form';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { ProductsService } from 'src/app/services';
import { Product } from 'src/app/interfaces';
import { Route } from '@angular/compiler/src/core';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';


@NgModule({
  declarations: [
    ProductPricesComponent,
    ProductsListComponent,
    ProductsEditorComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    SimpleFormModule.forChildren({
      path: 'products',
      listComponent: ProductsListComponent,
      editorComponent: ProductsEditorComponent,
      resolver: ProductsResolverService,
    }),
  ],
})
export class ProductsModule { }
