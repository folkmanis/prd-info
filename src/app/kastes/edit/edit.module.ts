import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { SimpleFormTypedModule } from 'src/app/library/simple-form-typed';
import { KastesCommonModule } from '../common/kastes-common.module';
import { JobInfoComponent } from './job-info/job-info.component';
import { ActiveVeikalsDirective } from './pakosanas-saraksts/active-veikals.directive';
import { PakosanasSarakstsComponent } from './pakosanas-saraksts/pakosanas-saraksts.component';
import { TotalsComponent } from './pakosanas-saraksts/totals/totals.component';
import { VeikalsEditComponent } from './pakosanas-saraksts/veikals-edit/veikals-edit.component';
import { PasutijumiTabulaComponent } from './pasutijumi-tabula/pasutijumi-tabula.component';
import { PasutijumsEditComponent } from './pasutijums-edit/pasutijums-edit.component';
import { KastesJobResolverService } from './services/kastes-job-resolver.service';
import { PlusSignPipe } from './services/plus-sign.pipe';


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
    MaterialLibraryModule,
    LibraryModule,
    KastesCommonModule,
    SimpleFormTypedModule.forChildren({
      path: '',
      listComponent: PasutijumiTabulaComponent,
      editorComponent: PasutijumsEditComponent,
      resolver: KastesJobResolverService,
    })
  ]
})
export class EditModule { }
