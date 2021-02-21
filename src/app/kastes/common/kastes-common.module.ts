import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorTotalsComponent } from './color-totals/color-totals.component';
import { KastesTotalsComponent } from './kastes-totals/kastes-totals.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';


@NgModule({
  declarations: [
    ColorTotalsComponent,
    KastesTotalsComponent,
  ],
  imports: [
    CommonModule,
    MaterialLibraryModule,
  ],
  exports: [
    ColorTotalsComponent,
    KastesTotalsComponent,
  ]
})
export class KastesCommonModule { }
