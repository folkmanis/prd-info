import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library/library.module';
import { SimpleFormModule } from 'src/app/library/simple-form';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerResolverService } from './services/customer-resolver.service';
import { PaytraqCustomerComponent } from './customer-edit/paytraq-customer/paytraq-customer.component';
import { PaytraqCustomerTableComponent } from './customer-edit/paytraq-customer/paytraq-customer-table/paytraq-customer-table.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';


@NgModule({
  declarations: [
    CustomersListComponent,
    CustomerEditComponent,
    PaytraqCustomerComponent,
    PaytraqCustomerTableComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    SimpleFormModule.forChildren({
      path: 'customers',
      editorComponent: CustomerEditComponent,
      listComponent: CustomersListComponent,
      resolver: CustomerResolverService,
    })
  ],

})
export class CustomersModule { }
