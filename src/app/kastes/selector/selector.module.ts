import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';

import { SelectorRoutingModule } from './selector-routing.module';
import { SelectorComponent } from './selector.component';
import { LabelsComponent } from './labels/labels.component';
import { TabulaComponent } from './tabula/tabula.component';
import { ColorsOutputComponent } from './tabula/kopskaiti/colors-output/colors-output.component';
import { KopskaitiComponent } from './tabula/kopskaiti/kopskaiti.component';
import { RefreshTableComponent } from './tabula/refresh-table/refresh-table.component';
import { RowIdDirective } from './tabula/row-id.directive';
import { OrderTotalsComponent } from './order-totals/order-totals.component';


@NgModule({
  declarations: [
    SelectorComponent,
    LabelsComponent,
    TabulaComponent,
    ColorsOutputComponent,
    KopskaitiComponent,
    RefreshTableComponent,
    RowIdDirective,
    OrderTotalsComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    SelectorRoutingModule
  ]
})
export class SelectorModule { }
