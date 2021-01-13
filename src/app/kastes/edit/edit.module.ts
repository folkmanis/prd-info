import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library';
import { RetrieveFn, SimpleFormModule } from 'src/app/library/simple-form';
import { PasutijumiTabulaComponent } from './pasutijumi-tabula/pasutijumi-tabula.component';
import { PasutijumsEditComponent } from './pasutijums-edit/pasutijums-edit.component';
import { JobInfoComponent } from './job-info/job-info.component';
import { KastesCommonModule } from '../common/kastes-common.module';
import { PakosanasSarakstsComponent } from './pakosanas-saraksts/pakosanas-saraksts.component';
import { TotalsComponent } from './pakosanas-saraksts/totals/totals.component';
import { VeikalsEditComponent } from './pakosanas-saraksts/veikals-edit/veikals-edit.component';
import { ActiveVeikalsDirective } from './pakosanas-saraksts/active-veikals.directive';
import { PlusSignPipe } from './services/plus-sign.pipe';
import { KastesJob } from 'src/app/interfaces';
import { PasutijumiService } from '../services/pasutijumi.service';
import { EMPTY } from 'rxjs';

function pasRetrieveFnFactory(serv: PasutijumiService): RetrieveFn<KastesJob> {
  return (route) => {
    const id: number = +route.paramMap.get('id');
    if (isNaN(id)) { return EMPTY; }
    return serv.getOrder(id);
  };
}


@NgModule({
  declarations: [
    PasutijumiTabulaComponent,
    PasutijumsEditComponent,
    JobInfoComponent,
    PakosanasSarakstsComponent,
    TotalsComponent,
    VeikalsEditComponent,
    ActiveVeikalsDirective,
    PlusSignPipe
  ],
  imports: [
    CommonModule,
    LibraryModule,
    KastesCommonModule,
    SimpleFormModule.forChildren({
      path: '',
      listComponent: PasutijumiTabulaComponent,
      editorComponent: PasutijumsEditComponent,
      retrieveFnFactory: pasRetrieveFnFactory,
      resolverDeps: PasutijumiService,
    })
  ]
})
export class EditModule { }
