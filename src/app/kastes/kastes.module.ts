import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from '../library/library.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { KastesPreferencesService } from './services/kastes-preferences.service';
import { PasutijumiService } from './services/pasutijumi.service';

import { PasutijumiModule } from './pasutijumi/pasutijumi.module';

import { KastesComponent } from './kastes.component';
import { SelectorComponent } from './select-tabula/selector/selector.component';
import { LabelsComponent } from './select-tabula/labels/labels.component';
import { TabulaComponent } from './select-tabula/tabula/tabula.component';
import { KastesRoutingModule } from './kastes-routing.module';
import { SelectPasutijumsComponent } from './select-tabula/select-pasutijums/select-pasutijums.component';
import { ColorsOutputComponent } from './select-tabula/tabula/colors-output/colors-output.component';
import { KastesMainMenuComponent } from './kastes-main-menu/kastes-main-menu.component';
import { KopskaitiComponent } from './select-tabula/kopskaiti/kopskaiti.component';
import { SelectTabulaComponent } from './select-tabula/select-tabula.component';
import { RefreshTableComponent } from './select-tabula/refresh-table/refresh-table.component';

@NgModule({
  declarations: [
    KastesComponent,
    SelectPasutijumsComponent,
    SelectorComponent,
    LabelsComponent,
    TabulaComponent,
    ColorsOutputComponent,
    KastesMainMenuComponent,
    KopskaitiComponent,
    SelectTabulaComponent,
    RefreshTableComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    PasutijumiModule,
    KastesRoutingModule,
  ],
  providers: [
    KastesPreferencesService,
    PasutijumiService,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ]
})
export class KastesModule { }
