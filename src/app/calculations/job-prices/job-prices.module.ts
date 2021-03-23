import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

import { CalculationsLibraryModule } from '../calculations-library/calculations-library.module';
import { JobPricesRoutingModule } from './job-prices-routing.module';
import { JobPricesComponent } from './job-prices.component';


@NgModule({
  declarations: [
    JobPricesComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    CalculationsLibraryModule,
    MaterialLibraryModule,
    JobPricesRoutingModule,
  ]
})
export class JobPricesModule { }
