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
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { APP_PARAMS, PRD_DEFAULTS } from './app-params';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { configProvider } from './services/config.provider';
import { DATE_FNS_LOCALE } from './library/date-services';
import { lv } from 'date-fns/locale';
import { httpInterceptorsProvider } from './library/http/http-interceptors-provider';

import { ClassTransformer } from 'class-transformer';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialLibraryModule,
    LibraryModule,
    LayoutModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'lv' },
    { provide: DATE_FNS_LOCALE, useValue: lv },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: ErrorHandler, useClass: ErrorsService, },
    httpInterceptorsProvider,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: APP_PARAMS, useValue: PRD_DEFAULTS },
    configProvider,
    { provide: ClassTransformer },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
