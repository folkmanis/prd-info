import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from '../library/library.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { UserEditorComponent } from './users/user-editor/user-editor.component';


@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    UserEditorComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    AdminRoutingModule,
  ]
})
export class AdminModule { }
