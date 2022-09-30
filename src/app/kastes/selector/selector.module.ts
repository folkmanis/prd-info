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
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { KastesLocalStorageInterceptor } from './services/kastes-local-storage.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


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
    MaterialLibraryModule,
    SelectorRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KastesLocalStorageInterceptor,
      multi: true,
    }
  ]
})
export class SelectorModule { }
