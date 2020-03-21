import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from '../library/library.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { UserEditorComponent } from './users/user-editor/user-editor.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { PasswordChangeDialogComponent } from './users/user-editor/password-change-dialog/password-change-dialog.component';
import { AdminMainMenuComponent } from './admin-main-menu/admin-main-menu.component';
import { ModulePreferencesComponent } from './module-preferences/module-preferences.component';
import { KastesPreferencesComponent } from './module-preferences/kastes-preferences/kastes-preferences.component';
import { SystemPreferencesComponent } from './module-preferences/system-preferences/system-preferences.component';
import { LogfileComponent } from './logfile/logfile.component';
import { LogfileTableComponent } from './logfile/logfile-table/logfile-table.component';


@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    UserEditorComponent,
    NewUserComponent,
    PasswordChangeDialogComponent,
    AdminMainMenuComponent,
    ModulePreferencesComponent,
    KastesPreferencesComponent,
    SystemPreferencesComponent,
    LogfileComponent,
    LogfileTableComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    AdminRoutingModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
})
export class AdminModule { }
