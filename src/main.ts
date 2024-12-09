import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeLv from '@angular/common/locales/lv';
import { DEFAULT_CURRENCY_CODE, ErrorHandler, LOCALE_ID, enableProdMode } from '@angular/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, TitleStrategy, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { ClassTransformer } from 'class-transformer';
import { lv } from 'date-fns/locale';
import { APP_ROUTES } from './app/app-routes';
import { AppComponent } from './app/app.component';
import { AppClassTransformerService } from './app/library';
import { DATE_FNS_LOCALE } from './app/library/date-services';
import { ErrorsService } from './app/library/errors/errors.service';
import { httpInterceptors } from './app/library/http/http-interceptors';
import { environment } from './environments/environment';
import { ModulePageTitleStrategy } from './app/services/module-page-title.strategy';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

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
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      },
    },
    { provide: ErrorHandler, useClass: ErrorsService },
    { provide: ClassTransformer, useExisting: AppClassTransformerService },
    { provide: TitleStrategy, useClass: ModulePageTitleStrategy },
    provideRouter(APP_ROUTES, withComponentInputBinding(), withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(withInterceptors(httpInterceptors)),
    provideAnimationsAsync(),
    provideDateFnsAdapter(),
  ],
  // eslint-disable-next-line no-console
}).catch((err) => console.error(err));
