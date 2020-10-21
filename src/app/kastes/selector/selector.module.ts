import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';

import { SelectorRoutingModule } from './selector-routing.module';
import { SelectPasutijumsComponent } from './select-pasutijums/select-pasutijums.component';
import { SelectorComponent } from './selector.component';
import { LabelsComponent } from './labels/labels.component';
import { TabulaComponent } from './tabula/tabula.component';
import { ColorsOutputComponent } from './kopskaiti/colors-output/colors-output.component';
import { KopskaitiComponent } from './kopskaiti/kopskaiti.component';
import { RefreshTableComponent } from './refresh-table/refresh-table.component';


@NgModule({
  declarations: [
    SelectPasutijumsComponent,
    SelectorComponent,
    LabelsComponent,
    TabulaComponent,
    ColorsOutputComponent,
    KopskaitiComponent,
    RefreshTableComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    SelectorRoutingModule
  ]
})
export class SelectorModule { }
