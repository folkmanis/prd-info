import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';
import { SimpleFormModule } from 'src/app/library/simple-form';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

import { MaterialsListComponent } from './materials-list/materials-list.component';
import { MaterialsEditComponent } from './materials-edit/materials-edit.component';
import { MaterialsResolverService } from './services/materials-resolver.service';
import { MaterialsPricesComponent } from './materials-edit/materials-prices/materials-prices.component';
import { MaterialsPriceDialogComponent } from './materials-edit/materials-price-dialog/materials-price-dialog.component';



@NgModule({
  declarations: [
    MaterialsListComponent,
    MaterialsEditComponent,
    MaterialsPricesComponent,
    MaterialsPriceDialogComponent
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    SimpleFormModule.forChildren({
      path: 'materials',
      listComponent: MaterialsListComponent,
      editorComponent: MaterialsEditComponent,
      resolver: MaterialsResolverService,
    })
  ]
})
export class MaterialsModule { }
