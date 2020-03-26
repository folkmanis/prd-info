import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsAdminRoutingModule } from './jobs-admin-routing.module';
import { JobsAdminComponent } from './jobs-admin.component';
import { CustomersComponent } from './customers/customers.component';


@NgModule({
  declarations: [JobsAdminComponent, CustomersComponent],
  imports: [
    CommonModule,
    JobsAdminRoutingModule
  ]
})
export class JobsAdminModule { }
