import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from 'src/app/library/library.module';
import { SimpleFormTypedModule } from 'src/app/library/simple-form-typed';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentEditComponent } from './equipment-edit/equipment-edit.component';

import { EquipmentResolverService } from './services/equipment-resolver.service';

@NgModule({
  declarations: [
    EquipmentListComponent,
    EquipmentEditComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    SimpleFormTypedModule.forChildren({
      listComponent: EquipmentListComponent,
      editorComponent: EquipmentEditComponent,
      resolver: EquipmentResolverService,
      path: 'equipment',
    })
  ]
})
export class EquipmentModule { }
