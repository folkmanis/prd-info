import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from '../library/library.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminMainMenuComponent } from './admin-main-menu/admin-main-menu.component';
import { ModulePreferencesComponent } from './module-preferences/module-preferences.component';
import { KastesPreferencesComponent } from './module-preferences/kastes-preferences/kastes-preferences.component';
import { SystemPreferencesComponent } from './module-preferences/system-preferences/system-preferences.component';
import { LogfileComponent } from './logfile/logfile.component';
import { LogfileTableComponent } from './logfile/logfile-table/logfile-table.component';
import { LogFilterComponent } from './logfile/log-filter/log-filter.component';
import { JobsPreferencesComponent } from './module-preferences/jobs-preferences/jobs-preferences.component';
import { CategoryDialogComponent } from './module-preferences/jobs-preferences/category-dialog/category-dialog.component';
import { UsersModule } from './users/users.module';
import { ModuleGroupComponent } from './module-group/module-group.component';
import { ColorSliderComponent } from './module-preferences/kastes-preferences/color-slider/color-slider.component';
import { ModulePreferencesModule } from './module-preferences/module-preferences.module';

@NgModule({
  declarations: [
    AdminMainMenuComponent,
    ModulePreferencesComponent,
    KastesPreferencesComponent,
    SystemPreferencesComponent,
    LogfileComponent,
    LogfileTableComponent,
    LogFilterComponent,
    JobsPreferencesComponent,
    CategoryDialogComponent,
    ModuleGroupComponent,
    ColorSliderComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    UsersModule,
    AdminRoutingModule,
    ModulePreferencesModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class AdminModule { }
