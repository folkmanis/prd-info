import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetrieveFn, SimpleFormModule } from 'src/app/library/simple-form';

import { LibraryModule } from 'src/app/library';
import { PasutijumiTabulaComponent } from './pasutijumi-tabula/pasutijumi-tabula.component';
import { PasutijumsIdComponent } from './pasutijums-id/pasutijums-id.component';
import { ApjomiTotalsComponent } from './pasutijums-id/apjomi-totals/apjomi-totals.component';
import { DeletedSnackbarComponent } from './pasutijums-id/deleted-snackbar/deleted-snackbar.component';

import { KastesCommonModule } from '../common/kastes-common.module';
import { PasutijumiService } from '../services/pasutijumi.service';
import { KastesJob } from 'src/app/interfaces';
import { ActivatedRouteSnapshot } from '@angular/router';
import { EMPTY } from 'rxjs';

function pasRetrieveFnFactory(serv: PasutijumiService): RetrieveFn<KastesJob> {
  return (route: ActivatedRouteSnapshot) => {
    const id = +route.paramMap.get('id');
    return isNaN(id) ? EMPTY : serv.getOrder(id);
  };
}

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
      retrieveFnFactory: pasRetrieveFnFactory,
      resolverDeps: PasutijumiService,
      listComponent: PasutijumiTabulaComponent,
      editorComponent: PasutijumsIdComponent,
    })
  ]
})
export class PasutijumiModule { }
