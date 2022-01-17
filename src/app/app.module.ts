import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';

import { LibraryModule } from './library/library.module';

import { LayoutModule } from './layout/layout.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';
import { ErrorsService } from './library/errors/errors.service';

import { registerLocaleData } from '@angular/common';
import localeLv from '@angular/common/locales/lv';
registerLocaleData(localeLv);
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { APP_PARAMS, PRD_DEFAULTS } from './app-params';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { DATE_FNS_LOCALE } from './library/date-services';
import { lv } from 'date-fns/locale';
import { httpInterceptorsProvider } from './library/http/http-interceptors-provider';

import { ClassTransformer } from 'class-transformer';

import { MatDateFnsModule } from '@angular/material-date-fns-adapter';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialLibraryModule,
    LibraryModule,
    LayoutModule,
    AppRoutingModule,
    MatDateFnsModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'lv' },
    { provide: DATE_FNS_LOCALE, useValue: lv },
    { provide: MAT_DATE_LOCALE, useExisting: DATE_FNS_LOCALE },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: ErrorHandler, useClass: ErrorsService, },
    httpInterceptorsProvider,
    { provide: APP_PARAMS, useValue: PRD_DEFAULTS },
    { provide: ClassTransformer },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
