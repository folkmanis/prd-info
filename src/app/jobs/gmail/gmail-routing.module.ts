import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GmailComponent } from './gmail.component';
import { MessageComponent } from './message/message.component';
import { ThreadResolverService } from './services/thread-resolver.service';

const routes: Routes = [
  {
    path: ':id',
    component: MessageComponent,
    resolve: {
      thread: ThreadResolverService
    },
  },
  {
    path: '',
    component: GmailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GmailRoutingModule { }
