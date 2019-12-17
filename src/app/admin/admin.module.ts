import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';


@NgModule({
  declarations: [AdminComponent, UsersComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    AdminRoutingModule,
  ]
})
export class AdminModule { }
