import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

import { GmailRoutingModule } from './gmail-routing.module';
import { GmailComponent } from './gmail.component';
import { MessageComponent } from './message/message.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { ThreadComponent } from './thread/thread.component';
import { ThreadsFilterComponent } from './threads-filter/threads-filter.component';
import { ThreadsPaginatorDirective } from './thread/threads-paginator.directive';


@NgModule({
  declarations: [
    GmailComponent,
    MessageComponent,
    AttachmentsComponent,
    ThreadComponent,
    ThreadsFilterComponent,
    ThreadsPaginatorDirective
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    GmailRoutingModule
  ]
})
export class GmailModule { }
