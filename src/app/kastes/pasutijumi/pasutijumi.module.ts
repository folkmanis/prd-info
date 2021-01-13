import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library';
import { SimpleFormModule } from 'src/app/library/simple-form';
import { KastesCommonModule } from '../common/kastes-common.module';
import { PasutijumiTabulaComponent } from './pasutijumi-tabula/pasutijumi-tabula.component';
import { ApjomiTotalsComponent } from './pasutijums-id/apjomi-totals/apjomi-totals.component';
import { DeletedSnackbarComponent } from './pasutijums-id/deleted-snackbar/deleted-snackbar.component';
import { PasutijumsIdComponent } from './pasutijums-id/pasutijums-id.component';
import { PasutijumsResolverService } from './services/pasutijums-resolver.service';


@NgModule({
  declarations: [
    PasutijumiTabulaComponent,
    PasutijumsIdComponent,
    ApjomiTotalsComponent,
    DeletedSnackbarComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    KastesCommonModule,
    SimpleFormModule.forChildren({
      path: 'pasutijumi',
      listComponent: PasutijumiTabulaComponent,
      editorComponent: PasutijumsIdComponent,
      resolver: PasutijumsResolverService,
    })
  ]
})
export class PasutijumiModule { }
