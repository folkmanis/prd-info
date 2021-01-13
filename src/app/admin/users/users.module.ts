import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library/library.module';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { SimpleFormModule } from 'src/app/library/simple-form/simple-form.module';
import { PasswordInputComponent } from './password-input/password-input.component';
import { PasswordChangeDialogComponent } from './password-change-dialog/password-change-dialog.component';
import { UsersService } from '../services/users.service';
import { RetrieveFn } from 'src/app/library/simple-form';
import { User } from 'src/app/interfaces/user';
import { EMPTY } from 'rxjs';

function userRetrieveFnFactory(srv: UsersService): RetrieveFn<User> {
  return (route) => {
    const id = route.paramMap.get('id');
    if (!id?.length) { return EMPTY; }
    return srv.getUser(id);
  };
}


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
      retrieveFnFactory: userRetrieveFnFactory,
      resolverDeps: UsersService,
    })
  ]
})
export class UsersModule { }
