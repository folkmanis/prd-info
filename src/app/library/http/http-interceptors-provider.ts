import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CacheInterceptorService } from './cache-interceptor.service';
import { VersionInterceptorService } from './version-interceptor.service';
import { InstanceIdInterceptorService } from './instance-id-interceptor.service';

export const httpInterceptorsProvider: Provider[] = [
    { provide: HTTP_INTERCEPTORS, useClass: InstanceIdInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: VersionInterceptorService, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptorService, multi: true, },
];
