import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LibraryModule } from 'src/app/library/library.module';

import { JobsAdminRoutingModule } from './jobs-admin-routing.module';
import { JobsAdminComponent } from './jobs-admin.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { CacheInterceptorService } from './services/cache-interceptor.service';
import { HttpCacheService } from './services/http-cache.service';

@NgModule({
  declarations: [
    JobsAdminComponent,
    MainMenuComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    ProductsModule,
    CustomersModule,
    JobsAdminRoutingModule,
  ],
  providers: [
    HttpCacheService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptorService, multi: true, }
  ]
})
export class JobsAdminModule { }
