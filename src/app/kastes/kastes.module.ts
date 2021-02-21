import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from '../library/library.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { KastesPreferencesService } from './services/kastes-preferences.service';
import { SelectorModule } from './selector/selector.module';

import { KastesRoutingModule } from './kastes-routing.module';
import { KastesMainMenuComponent } from './kastes-main-menu/kastes-main-menu.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';


@NgModule({
  declarations: [
    KastesMainMenuComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    SelectorModule,
    KastesRoutingModule,
    MaterialLibraryModule,
  ],
  providers: [
    KastesPreferencesService,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ]
})
export class KastesModule { }
