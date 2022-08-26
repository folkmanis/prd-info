import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library/library.module';
import { SimpleFormTypedModule } from 'src/app/library/simple-form-typed/simple-form-typed.module';
import { UserResolverService } from './services/user-resolver.service';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersListComponent } from './users-list/users-list.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { SessionsComponent } from './user-edit/sessions/sessions.component';


@NgModule({
  declarations: [
    UsersListComponent,
    UserEditComponent,
    SessionsComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    SimpleFormTypedModule.forChildren({
      path: 'users',
      editorComponent: UserEditComponent,
      listComponent: UsersListComponent,
      resolver: UserResolverService,
    })
  ]
})
export class UsersModule { }
