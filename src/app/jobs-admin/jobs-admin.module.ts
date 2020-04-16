import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';
import { HTTP_INTERCEPTORS, CacheInterceptorService } from 'src/app/library/http';
import { JobsAdminRoutingModule } from './jobs-admin-routing.module';
import { JobsAdminComponent } from './jobs-admin.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';

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
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptorService, multi: true, },
  ],
})
export class JobsAdminModule { }
