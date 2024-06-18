import { HttpInterceptorFn } from '@angular/common/http';
import { cacheInterceptor } from './cache-interceptor';
import { gmailLoginInterceptor } from './gmail-login-interceptor';
import { instanceIdInterceptor } from "./instance-id-interceptor";
import { versionInterceptor } from './version-interceptor';

export const httpInterceptors: HttpInterceptorFn[] = [
    instanceIdInterceptor,
    versionInterceptor,
    cacheInterceptor,
    gmailLoginInterceptor,
];
