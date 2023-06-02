import { Route } from '@angular/router';
import { ThreadComponent } from './thread/thread.component';
import { resolveThread } from './services/thread-resolver';
import { GmailComponent } from './gmail.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GmailLoginInterceptor } from './services/gmail-login.interceptor';

export default [
    {
        path: '',
        providers: [
            { provide: HTTP_INTERCEPTORS, useClass: GmailLoginInterceptor, multi: true }
        ],
        children: [
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
        ],
    },
] as Route[];