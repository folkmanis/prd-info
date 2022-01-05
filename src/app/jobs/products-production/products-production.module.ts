import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

import { ProductsProductionRoutingModule } from './products-production-routing.module';
import { ProductsProductionComponent } from './products-production.component';
import { FilterComponent } from './filter/filter.component';
import { FilterSummaryComponent } from './filter/filter-summary/filter-summary.component';
import { ProductsTableComponent } from './products-table/products-table.component';


@NgModule({
  declarations: [
    ProductsProductionComponent,
    FilterComponent,
    FilterSummaryComponent,
    ProductsTableComponent
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    ProductsProductionRoutingModule,
  ]
})
export class ProductsProductionModule { }
