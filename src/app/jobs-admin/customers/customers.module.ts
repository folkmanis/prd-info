import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { CustomersService } from './services/customers.service';
import { EditComponent } from './edit/edit.component';
import { NewComponent } from './new/new.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';



@NgModule({
  declarations: [
    CustomersComponent,
    EditComponent,
    NewComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    CustomersRoutingModule,
  ],
  providers: [
    CustomersService,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ]

})
export class CustomersModule { }
