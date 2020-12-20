import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimpleFormModule } from 'src/app/library/simple-form';

import { LibraryModule } from 'src/app/library';
import { PasutijumiTabulaComponent } from './pasutijumi-tabula/pasutijumi-tabula.component';
import { PasutijumsIdComponent } from './pasutijums-id/pasutijums-id.component';
import { ColorTotalsComponent } from './pasutijums-id/color-totals/color-totals.component';
import { ApjomiTotalsComponent } from './pasutijums-id/apjomi-totals/apjomi-totals.component';
import { PasutijumiResolverService } from './services/pasutijumi-resolver.service';
import { DeletedSnackbarComponent } from './pasutijums-id/deleted-snackbar/deleted-snackbar.component';


@NgModule({
  declarations: [
    PasutijumiTabulaComponent,
    PasutijumsIdComponent,
    ColorTotalsComponent,
    ApjomiTotalsComponent,
    DeletedSnackbarComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    SimpleFormModule.forChildren({
      path: 'pasutijumi',
      resolver: PasutijumiResolverService,
      listComponent: PasutijumiTabulaComponent,
      editorComponent: PasutijumsIdComponent,
    })
  ]
})
export class PasutijumiModule { }
