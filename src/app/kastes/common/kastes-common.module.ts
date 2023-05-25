import { NgModule } from '@angular/core';

import { ColorTotalsComponent } from './color-totals/color-totals.component';
import { KastesTotalsComponent } from './kastes-totals/kastes-totals.component';


@NgModule({
  declarations: [
  ],
  imports: [
    KastesTotalsComponent,
    ColorTotalsComponent,
  ],
  exports: [
    ColorTotalsComponent,
    KastesTotalsComponent,
  ]
})
export class KastesCommonModule { }
