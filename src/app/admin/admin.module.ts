import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from '../library/library.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminMainMenuComponent } from './admin-main-menu/admin-main-menu.component';
import { LogfileComponent } from './logfile/logfile.component';
import { LogfileTableComponent } from './logfile/logfile-table/logfile-table.component';
import { LogFilterComponent } from './logfile/log-filter/log-filter.component';
import { UsersModule } from './users/users.module';
import { ModulePreferencesModule } from './module-preferences/module-preferences.module';

@NgModule({
  declarations: [
    AdminMainMenuComponent,
    LogfileComponent,
    LogfileTableComponent,
    LogFilterComponent,
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
