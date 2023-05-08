import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GmailComponent } from './gmail.component';
import { resolveThread } from './services/thread-resolver';
import { ThreadComponent } from './thread/thread.component';

const routes: Routes = [
  {
    path: ':id',
    component: ThreadComponent,
    resolve: {
      thread: resolveThread
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
