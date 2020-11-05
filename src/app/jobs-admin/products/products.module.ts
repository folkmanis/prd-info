import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library/library.module';
import { SimpleFormModule } from 'src/app/library/simple-form';
import { ProductPricesComponent } from './products-editor/product-prices/product-prices.component';
import { ProductsEditorComponent } from './products-editor/products-editor.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductFormService } from './services/product-form.service';
import { ProductsResolverService } from './services/products-resolver.service';


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
      formService: ProductFormService,
      listComponent: ProductsListComponent,
      editorComponent: ProductsEditorComponent,
      resolver: ProductsResolverService,
    }),
  ],
})
export class ProductsModule { }
