import { Route } from '@angular/router';
import { ThreadComponent } from './thread/thread.component';
import { resolveThread } from './services/thread-resolver';
import { GmailComponent } from './gmail.component';


export default [
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
        pathMatch: 'full',
    },
] as Route[];