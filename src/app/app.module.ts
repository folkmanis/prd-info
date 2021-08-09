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
import { VersionInterceptorService } from './library/http/version-interceptor.service';

import { registerLocaleData } from '@angular/common';
import localeLv from '@angular/common/locales/lv';
registerLocaleData(localeLv);
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { APP_PARAMS, PRD_DEFAULTS } from './app-params';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { configProvider } from './services/config.provider';
import { MessagesListComponent } from './layout/messaging/messages-list/messages-list.component';
import { MessagesTriggerDirective } from './layout/messaging/messages-trigger.directive';
import { DATE_FNS_LOCALE } from './library/date-services';
import { lv } from 'date-fns/locale';
import { MessageActionsPipe } from './layout/messaging/message-pipes/message-actions.pipe';
import { MessageDescriptionPipe } from './layout/messaging/message-pipes/message-description.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SideMenuComponent,
    MainMenuComponent,
    ToolbarComponent,
    MessagesListComponent,
    MessagesTriggerDirective,
    MessageActionsPipe,
    MessageDescriptionPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialLibraryModule,
    LibraryModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'lv' },
    { provide: DATE_FNS_LOCALE, useValue: lv },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: ErrorHandler, useClass: ErrorsService, },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptorService, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: VersionInterceptorService, multi: true, },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: APP_PARAMS, useValue: PRD_DEFAULTS },
    configProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
