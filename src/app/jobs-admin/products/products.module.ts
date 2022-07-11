import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library/library.module';
import { SimpleFormTypedModule } from 'src/app/library/simple-form-typed';
import { ProductPricesComponent } from './products-editor/product-prices/product-prices.component';
import { ProductsEditorComponent } from './products-editor/products-editor.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductResolverService } from './services/product-resolver.service';
import { PaytraqProductComponent } from './products-editor/paytraq-product/paytraq-product.component';
import { PaytraqProductTableComponent } from './products-editor/paytraq-product/paytraq-product-table/paytraq-product-table.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { ProductProductionStagesComponent } from './products-editor/product-production-stages/product-production-stages.component';
import { ProductionStageMaterialComponent } from './products-editor/production-stage-material/production-stage-material.component';
import { MaterialUnitsDirective } from './products-editor/production-stage-material/material-units.directive';

@NgModule({
  declarations: [
    ProductPricesComponent,
    ProductsListComponent,
    ProductsEditorComponent,
    PaytraqProductComponent,
    PaytraqProductTableComponent,
    ProductProductionStagesComponent,
    ProductionStageMaterialComponent,
    MaterialUnitsDirective,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    SimpleFormTypedModule.forChildren({
      path: 'products',
      listComponent: ProductsListComponent,
      editorComponent: ProductsEditorComponent,
      resolver: ProductResolverService,
    }),
  ],
})
export class ProductsModule { }
