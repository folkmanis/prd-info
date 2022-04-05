import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

import { GmailRoutingModule } from './gmail-routing.module';
import { GmailComponent } from './gmail.component';
import { MessageComponent } from './message/message.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { ThreadComponent } from './thread/thread.component';
import { ThreadsFilterComponent } from './threads-filter/threads-filter.component';
import { ThreadsPaginatorDirective } from './thread/threads-paginator.directive';
import { GmailLoginInterceptor } from './services/gmail-login.interceptor';


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
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: GmailLoginInterceptor, multi: true }
  ]
})
export class GmailModule { }
