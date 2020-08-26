import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from 'src/app/library';
import { PasutijumiRoutingModule } from './pasutijumi-routing.module';
import { PasutijumiTabulaComponent } from './pasutijumi-tabula/pasutijumi-tabula.component';
import { TabulaButtonsComponent } from './tabula-buttons/tabula-buttons.component';
import { PasutijumsIdComponent } from './pasutijums-id/pasutijums-id.component';
import { ColorTotalsComponent } from './pasutijums-id/color-totals/color-totals.component';
import { ApjomiTotalsComponent } from './pasutijums-id/apjomi-totals/apjomi-totals.component';


@NgModule({
  declarations: [
    PasutijumiTabulaComponent,
    TabulaButtonsComponent,
    PasutijumsIdComponent,
    ColorTotalsComponent,
    ApjomiTotalsComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    PasutijumiRoutingModule,
  ]
})
export class PasutijumiModule { }
