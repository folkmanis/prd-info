import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from '../library/library.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminMainMenuComponent } from './admin-main-menu/admin-main-menu.component';
import { LogfileComponent } from './logfile/logfile.component';
import { LogfileTableComponent } from './logfile/logfile-table/logfile-table.component';
import { LogFilterComponent } from './logfile/log-filter/log-filter.component';
import { ModulePreferencesModule } from './module-preferences/module-preferences.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { LogCalendarComponent } from './logfile/log-filter/log-calendar/log-calendar.component';
import { LogLevelComponent } from './logfile/log-filter/log-level/log-level.component';

@NgModule({
  declarations: [
    AdminMainMenuComponent,
    LogfileComponent,
    LogfileTableComponent,
    LogFilterComponent,
    LogCalendarComponent,
    LogLevelComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    AdminRoutingModule,
    ModulePreferencesModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class AdminModule { }
