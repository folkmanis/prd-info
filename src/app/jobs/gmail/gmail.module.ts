import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

import { GmailRoutingModule } from './gmail-routing.module';
import { GmailComponent } from './gmail.component';
import { MessageComponent } from './message/message.component';


@NgModule({
  declarations: [
    GmailComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    GmailRoutingModule
  ]
})
export class GmailModule { }
