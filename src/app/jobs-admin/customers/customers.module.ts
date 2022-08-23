import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibraryModule } from 'src/app/library/library.module';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { CustomerResolverService } from './services/customer-resolver.service';
import { PaytraqCustomerComponent } from './customer-edit/paytraq-customer/paytraq-customer.component';
import { PaytraqCustomerTableComponent } from './customer-edit/paytraq-customer/paytraq-customer-table/paytraq-customer-table.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { FtpUserComponent } from './customer-edit/ftp-user/ftp-user.component';
import { InputUppercaseDirective } from './customer-edit/input-uppercase.directive';
import { CustomerContactsComponent } from './customer-contacts/customer-contacts.component';
import { CustomerContactEditorComponent } from './customer-contact-editor/customer-contact-editor.component';
import { SimpleFormTypedModule } from 'src/app/library/simple-form-typed';


@NgModule({
  declarations: [
    CustomersListComponent,
    CustomerEditComponent,
    PaytraqCustomerComponent,
    PaytraqCustomerTableComponent,
    FtpUserComponent,
    InputUppercaseDirective,
    CustomerContactsComponent,
    CustomerContactEditorComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    SimpleFormTypedModule.forChildren({
      path: 'customers',
      editorComponent: CustomerEditComponent,
      listComponent: CustomersListComponent,
      resolver: CustomerResolverService,
    })
  ],

})
export class CustomersModule { }
