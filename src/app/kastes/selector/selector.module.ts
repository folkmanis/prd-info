import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';

import { SelectorRoutingModule } from './selector-routing.module';
import { SelectorComponent } from './selector.component';
import { LabelsComponent } from './labels/labels.component';
import { TabulaComponent } from './tabula/tabula.component';
import { ColorsOutputComponent } from './kopskaiti/colors-output/colors-output.component';
import { KopskaitiComponent } from './kopskaiti/kopskaiti.component';
import { RowIdDirective } from './tabula/row-id.directive';
import { OrderTotalsComponent } from './order-totals/order-totals.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { KasteDialogComponent } from './kaste-dialog/kaste-dialog.component';
import { DrawerButtonDirective } from 'src/app/library/side-button/drawer-button.directive';


@NgModule({
  declarations: [
    SelectorComponent,
    LabelsComponent,
    TabulaComponent,
    ColorsOutputComponent,
    KopskaitiComponent,
    RowIdDirective,
    OrderTotalsComponent,
    KasteDialogComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    SelectorRoutingModule,
    DrawerButtonDirective,
  ],
})
export class SelectorModule { }
