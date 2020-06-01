import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LibraryModule } from './library/library.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';
import { SideMenuComponent } from './layout/side-menu/side-menu.component';
import { MainMenuComponent } from './layout/main-menu/main-menu.component';
import { ErrorsService } from './library/errors/errors.service';
import { CacheInterceptorService } from './library/http';

import { registerLocaleData } from '@angular/common';
import localeLv from '@angular/common/locales/lv';
registerLocaleData(localeLv);
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppParams } from './interfaces';
import { APP_PARAMS, PRD_DEFAULTS } from './app-params';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';
import { PanelDirective } from './layout/panel.directive';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SideMenuComponent,
    MainMenuComponent,
    ToolbarComponent,
    PanelDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LibraryModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'lv' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: ErrorHandler, useClass: ErrorsService, },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptorService, multi: true, },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: APP_PARAMS, useValue: PRD_DEFAULTS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
