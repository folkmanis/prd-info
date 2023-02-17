import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { UserSettingsComponent } from './user-settings.component';
import { GoogleInfoComponent } from './google-info/google-info.component';
import { UserSettingsRoutingModule } from './user-settings-routing.module';



@NgModule({
  declarations: [
    UserSettingsComponent,
    GoogleInfoComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    UserSettingsRoutingModule,
  ]
})
export class UserSettingsModule { }