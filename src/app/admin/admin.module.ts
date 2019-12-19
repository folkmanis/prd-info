import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from '../library/library.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { UserEditorComponent } from './users/user-editor/user-editor.component';
import { NewUserComponent } from './users/new-user/new-user.component';


@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    UserEditorComponent,
    NewUserComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    AdminRoutingModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ]
})
export class AdminModule { }
