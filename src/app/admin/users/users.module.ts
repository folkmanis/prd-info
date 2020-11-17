import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library/library.module';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserResolverService } from './services/user-resolver.service';
import { SimpleFormModule } from 'src/app/library/simple-form/simple-form.module';
import { PasswordInputComponent } from './password-input/password-input.component';
import { PasswordChangeDialogComponent } from './password-change-dialog/password-change-dialog.component';


@NgModule({
  declarations: [
    UsersListComponent,
    UserEditComponent,
    PasswordInputComponent,
    PasswordChangeDialogComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    SimpleFormModule.forChildren({
      path: 'users',
      editorComponent: UserEditComponent,
      listComponent: UsersListComponent,
      resolver: UserResolverService
    })
  ]
})
export class UsersModule { }
