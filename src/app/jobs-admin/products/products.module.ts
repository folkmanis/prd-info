import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library/library.module';
import { RetrieveFn, SimpleFormModule } from 'src/app/library/simple-form';
import { ProductPricesComponent } from './products-editor/product-prices/product-prices.component';
import { ProductsEditorComponent } from './products-editor/products-editor.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsService } from 'src/app/services';
import { Product } from 'src/app/interfaces';
import { EMPTY } from 'rxjs';

function prodRetrieveFnFactory(srv: ProductsService): RetrieveFn<Product> {
  return (route) => {
    const id: string = route.paramMap.get('id');
    if (!id || id.length !== 24) { return EMPTY; }
    return srv.getProduct(id);
  };
}


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
      resolverDeps: ProductsService,
      retrieveFnFactory: prodRetrieveFnFactory,
    }),
  ],
})
export class ProductsModule { }
