import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from '../library/library.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { KastesPreferencesService } from './services/kastes-preferences.service';
import { PasutijumiService } from './services/pasutijumi.service';

import { PasutijumiModule } from './pasutijumi/pasutijumi.module';
import { SelectTabulaModule } from './select-tabula/select-tabula.module';

import { KastesComponent } from './kastes.component';
import { KastesRoutingModule } from './kastes-routing.module';
import { KastesMainMenuComponent } from './kastes-main-menu/kastes-main-menu.component';

@NgModule({
  declarations: [
    KastesComponent,
    KastesMainMenuComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    SelectTabulaModule,
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
