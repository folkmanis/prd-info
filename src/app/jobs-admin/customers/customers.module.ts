import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library/library.module';
import { SimpleFormModule } from 'src/app/library/simple-form';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerResolverService } from './services/customer-resolver.service';


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
      resolver: CustomerResolverService,
    })
  ],

})
export class CustomersModule { }
