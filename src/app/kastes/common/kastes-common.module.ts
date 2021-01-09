import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorTotalsComponent } from './color-totals/color-totals.component';
import { KastesTotalsComponent } from './kastes-totals/kastes-totals.component';


@NgModule({
  declarations: [
    ColorTotalsComponent,
    KastesTotalsComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ColorTotalsComponent,
    KastesTotalsComponent,
  ]
})
export class KastesCommonModule { }
