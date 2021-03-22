import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { LibraryModule } from '../library/library.module';

import { CalculationsRoutingModule } from './calculations-routing.module';
import { CalculationsComponent } from './calculations.component';

import { PlateInvoiceModule } from './plate-invoice/plate-invoice.module';


@NgModule({
  declarations: [
    CalculationsComponent
  ],
  imports: [
    CommonModule,
    MaterialLibraryModule,
    LibraryModule,
    CalculationsRoutingModule,
    PlateInvoiceModule,
  ]
})
export class CalculationsModule { }
