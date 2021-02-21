import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library/library.module';
import { SimpleFormModule } from 'src/app/library/simple-form';
import { ProductPricesComponent } from './products-editor/product-prices/product-prices.component';
import { ProductsEditorComponent } from './products-editor/products-editor.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductResolverService } from './services/product-resolver.service';
import { PaytraqProductComponent } from './products-editor/paytraq-product/paytraq-product.component';
import { PaytraqProductTableComponent } from './products-editor/paytraq-product/paytraq-product-table/paytraq-product-table.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

@NgModule({
  declarations: [
    ProductPricesComponent,
    ProductsListComponent,
    ProductsEditorComponent,
    PaytraqProductComponent,
    PaytraqProductTableComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    SimpleFormModule.forChildren({
      path: 'products',
      listComponent: ProductsListComponent,
      editorComponent: ProductsEditorComponent,
      resolver: ProductResolverService,
    }),
  ],
})
export class ProductsModule { }
