import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library';
import { SimpleFormModule } from 'src/app/library/simple-form';
import { PasutijumiTabulaComponent } from './pasutijumi-tabula/pasutijumi-tabula.component';
import { PasutijumsEditComponent } from './pasutijums-edit/pasutijums-edit.component';
import { PasutijumsResolverService } from './services/pasutijums-resolver.service';
import { JobInfoComponent } from './job-info/job-info.component';
import { KastesCommonModule } from '../common/kastes-common.module';
import { PakosanasSarakstsComponent } from './pakosanas-saraksts/pakosanas-saraksts.component';
import { TotalsComponent } from './pakosanas-saraksts/totals/totals.component';
import { VeikalsEditComponent } from './pakosanas-saraksts/veikals-edit/veikals-edit.component';

@NgModule({
  declarations: [
    PasutijumiTabulaComponent,
    PasutijumsEditComponent,
    JobInfoComponent,
    PakosanasSarakstsComponent,
    TotalsComponent,
    VeikalsEditComponent
  ],
  imports: [
    CommonModule,
    LibraryModule,
    KastesCommonModule,
    SimpleFormModule.forChildren({
      path: '',
      listComponent: PasutijumiTabulaComponent,
      editorComponent: PasutijumsEditComponent,
      resolver: PasutijumsResolverService,
    })
  ]
})
export class EditModule { }
