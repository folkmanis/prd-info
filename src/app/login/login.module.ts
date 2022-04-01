import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { UserSettingsComponent } from './user-settings/user-settings.component';


@NgModule({
  declarations: [
    LoginComponent,
    UserSettingsComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
