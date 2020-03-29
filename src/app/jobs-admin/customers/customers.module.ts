import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { CustomersService } from './services/customers.service';



@NgModule({
  declarations: [
    CustomersComponent,
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    LibraryModule,
  ],
  providers: [
    CustomersService
  ]
})
export class CustomersModule { }
