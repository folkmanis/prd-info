import {
  DEFAULT_CURRENCY_CODE,
  ErrorHandler,
  LOCALE_ID,
  enableProdMode,
  importProvidersFrom,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

import { registerLocaleData } from '@angular/common';
import localeLv from '@angular/common/locales/lv';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ClassTransformer } from 'class-transformer';
import { lv } from 'date-fns/locale';
import { AppClassTransformerService } from './app/library';
import { DATE_FNS_LOCALE } from './app/library/date-services';
import { ErrorsService } from './app/library/errors/errors.service';
import { httpInterceptorsProvider } from './app/library/http/http-interceptors-provider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { APP_ROUTES } from './app/app-routes';
import { HttpClientModule } from '@angular/common/http';
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
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule,
      MatDateFnsModule,
      MatSnackBarModule,
      MatDialogModule
    ),
    ...httpInterceptorsProvider,
  ],
}).catch((err) => console.error(err));
