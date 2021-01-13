import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';

import { RetrieveFn, SimpleFormModule } from 'src/app/library/simple-form';

import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomersService } from 'src/app/services';
import { Customer } from 'src/app/interfaces';
import { EMPTY } from 'rxjs';

function customerRetrieveFnFactory(srv: CustomersService): RetrieveFn<Customer> {
  return (route) => {
    const id: string = route.paramMap.get('id');
    if (!id || id.length !== 24) { return EMPTY; }
    return srv.getCustomer(id);
  };
}


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
      resolverDeps: CustomersService,
      retrieveFnFactory: customerRetrieveFnFactory,
    })
  ],

})
export class CustomersModule { }
