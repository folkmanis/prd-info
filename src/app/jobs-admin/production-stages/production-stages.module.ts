import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

import { ProductionStagesListComponent } from './production-stages-list/production-stages-list.component';
import { ProductionStagesEditComponent } from './production-stages-edit/production-stages-edit.component';

import { ProductionStagesResolverService } from './services/production-stages-resolver.service';
import { SimpleFormTypedModule } from 'src/app/library/simple-form-typed';

@NgModule({
  declarations: [
    ProductionStagesListComponent,
    ProductionStagesEditComponent
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    SimpleFormTypedModule.forChildren({
      path: 'production-stages',
      resolver: ProductionStagesResolverService,
      listComponent: ProductionStagesListComponent,
      editorComponent: ProductionStagesEditComponent,
    })
  ]
})
export class ProductionStagesModule { }
