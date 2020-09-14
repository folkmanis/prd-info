import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from 'src/app/library/library.module';

import { SelectTabulaRoutingModule } from './select-tabula-routing.module';
import { SelectPasutijumsComponent } from './select-pasutijums/select-pasutijums.component';
import { SelectorComponent } from './selector/selector.component';
import { LabelsComponent } from './labels/labels.component';
import { TabulaComponent } from './tabula/tabula.component';
import { ColorsOutputComponent } from './tabula/colors-output/colors-output.component';
import { KopskaitiComponent } from './kopskaiti/kopskaiti.component';
import { SelectTabulaComponent } from './select-tabula.component';
import { RefreshTableComponent } from './refresh-table/refresh-table.component';

import { KastesTabulaService } from './services/kastes-tabula.service';


@NgModule({
  declarations: [
    SelectPasutijumsComponent,
    SelectorComponent,
    LabelsComponent,
    TabulaComponent,
    ColorsOutputComponent,
    KopskaitiComponent,
    SelectTabulaComponent,
    RefreshTableComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    SelectTabulaRoutingModule,
  ],
  providers: [
    KastesTabulaService,
  ]
})
export class SelectTabulaModule { }
