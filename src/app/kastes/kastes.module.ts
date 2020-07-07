import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from '../library/library.module';
import { ParserService } from 'src/app/library';
import { KastesPreferencesService } from './services/kastes-preferences.service';
import { KastesApiService } from './services/kastes-api.service';
import { KastesTabulaService } from './services/kastes-tabula.service';
import { PasutijumiService } from './services/pasutijumi.service';

import { UploadModule } from './upload/upload.module';
import { KastesComponent } from './kastes.component';
import { SelectorComponent } from './select-tabula/selector/selector.component';
import { LabelsComponent } from './select-tabula/labels/labels.component';
import { TabulaComponent } from './select-tabula/tabula/tabula.component';
import { AppRoutingModule } from './kastes-routing.module';
import { SelectPasutijumsComponent } from './select-tabula/select-pasutijums/select-pasutijums.component';
import { PasutijumiComponent } from './pasutijumi/pasutijumi.component';
import { ColorsOutputComponent } from './select-tabula/tabula/colors-output/colors-output.component';
import { KastesMainMenuComponent } from './kastes-main-menu/kastes-main-menu.component';
import { JaunsPasutijumsComponent } from './pasutijumi/jauns-pasutijums/jauns-pasutijums.component';
import { KopskaitiComponent } from './select-tabula/kopskaiti/kopskaiti.component';
import { SelectTabulaComponent } from './select-tabula/select-tabula.component';

@NgModule({
  declarations: [
    KastesComponent,
    SelectPasutijumsComponent,
    SelectorComponent,
    LabelsComponent,
    TabulaComponent,
    PasutijumiComponent,
    ColorsOutputComponent,
    KastesMainMenuComponent,
    JaunsPasutijumsComponent,
    KopskaitiComponent,
    SelectTabulaComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    AppRoutingModule,
    UploadModule,
  ],
  providers: [
    KastesPreferencesService,
    KastesApiService,
    KastesTabulaService,
    PasutijumiService,
  ]
})
export class KastesModule { }
