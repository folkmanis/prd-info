import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GmailComponent } from './gmail.component';
import { MessageComponent } from './message/message.component';
import { ThreadResolverService } from './services/thread-resolver.service';
import { ThreadComponent } from './thread/thread.component';

const routes: Routes = [
  {
    path: ':id',
    component: ThreadComponent,
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
