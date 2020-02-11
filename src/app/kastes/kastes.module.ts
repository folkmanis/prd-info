import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from '../library/library.module';
import { UploadModule } from './upload/upload.module';
import { KastesComponent } from './kastes.component';
import { SelectorComponent } from './selector/selector.component';
import { LabelsComponent } from './labels/labels.component';
import { TabulaComponent } from './tabula/tabula.component';
import { AppRoutingModule } from './kastes-routing.module';
import { SelectPasutijumsComponent } from './select-pasutijums/select-pasutijums.component';
import { PasutijumiComponent } from './pasutijumi/pasutijumi.component';
import { ColorsOutputComponent } from './tabula/colors-output/colors-output.component';
import { KastesMainMenuComponent } from './kastes-main-menu/kastes-main-menu.component';
import { JaunsPasutijumsComponent } from './pasutijumi/jauns-pasutijums/jauns-pasutijums.component';

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
  ],
  imports: [
    CommonModule,
    LibraryModule,
    AppRoutingModule,
    UploadModule,
  ],
})
export class KastesModule { }
