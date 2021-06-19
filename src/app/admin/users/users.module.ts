import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library/library.module';
import { SimpleFormModule } from 'src/app/library/simple-form/simple-form.module';
import { PasswordChangeDialogComponent } from './password-change-dialog/password-change-dialog.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { UserResolverService } from './services/user-resolver.service';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersListComponent } from './users-list/users-list.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { SessionsComponent } from './user-edit/sessions/sessions.component';


@NgModule({
  declarations: [
    UsersListComponent,
    UserEditComponent,
    PasswordInputComponent,
    PasswordChangeDialogComponent,
    SessionsComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    SimpleFormModule.forChildren({
      path: 'users',
      editorComponent: UserEditComponent,
      listComponent: UsersListComponent,
      resolver: UserResolverService,
    })
  ]
})
export class UsersModule { }
