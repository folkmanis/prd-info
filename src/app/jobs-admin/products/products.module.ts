import { NgModule, ModuleWithProviders, Type } from '@angular/core';
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
import { SimpleFormContainerComponent } from './simple-form-container/simple-form-container.component';
import { SimpleFormService } from './services/simple-form-service';
import { SimpleFormDirective } from './simple-form.directive';

interface SimpleFormModuleConfiguration {
  // editorComponent: Type<any>;
  formService: Type<any>;
}

@NgModule({
  imports: [
    CommonModule,
    LibraryModule,
    ProductsRoutingModule,
  ],
  declarations: [
    SimpleFormContainerComponent,
    SimpleFormDirective,
  ],
  exports: [
    SimpleFormContainerComponent,
    SimpleFormDirective,
  ]
})
export class SimpleFormModule {
  static formModule(conf: SimpleFormModuleConfiguration): ModuleWithProviders<SimpleFormModule> {
    return {
      ngModule: SimpleFormModule,
      providers: [
        conf.formService,
        { provide: SimpleFormService, useExisting: ProductFormService }
      ]
    };
  }
}

@NgModule({
  declarations: [
    ProductsComponent,
    ProductPricesComponent,
    ProductsListComponent,
    ProductsEditorComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    SimpleFormModule.formModule({ formService: ProductFormService }),
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    ProductsResolverService,
    // ProductFormService,
    // { provide: SimpleFormService, useExisting: ProductFormService }
  ]
})
export class ProductsModule { }
