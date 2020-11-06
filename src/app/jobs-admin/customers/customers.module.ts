import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';

import { SimpleFormModule } from 'src/app/library/simple-form';

import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomersFormService } from './services/customers-form.service';
import { CustomersResolverService } from './services/customers-resolver.service';



@NgModule({
  declarations: [
    CustomersListComponent,
    CustomerEditComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    SimpleFormModule.forChildren({
      path: 'customers',
      editorComponent: CustomerEditComponent,
      listComponent: CustomersListComponent,
      formService: CustomersFormService,
      resolver: CustomersResolverService,
    })
  ],

})
export class CustomersModule { }
