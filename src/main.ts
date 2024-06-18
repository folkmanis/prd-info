import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeLv from '@angular/common/locales/lv';
import { DEFAULT_CURRENCY_CODE, ErrorHandler, LOCALE_ID, enableProdMode } from '@angular/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { ClassTransformer } from 'class-transformer';
import { lv } from 'date-fns/locale';
import { APP_ROUTES } from './app/app-routes';
import { AppComponent } from './app/app.component';
import { AppClassTransformerService } from './app/library';
import { DATE_FNS_LOCALE } from './app/library/date-services';
import { ErrorsService } from './app/library/errors/errors.service';
import { httpInterceptors } from './app/library/http/http-interceptors';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeLv);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: LOCALE_ID, useValue: 'lv' },
    { provide: DATE_FNS_LOCALE, useValue: lv },
    { provide: MAT_DATE_LOCALE, useExisting: DATE_FNS_LOCALE },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    { provide: ErrorHandler, useClass: ErrorsService },
    { provide: ClassTransformer, useExisting: AppClassTransformerService },
    provideRouter(APP_ROUTES, withComponentInputBinding(), withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(withInterceptors(httpInterceptors)),
    provideAnimations(),
    provideDateFnsAdapter(),
  ],
}).catch((err) => console.error(err));
