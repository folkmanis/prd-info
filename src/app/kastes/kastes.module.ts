import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryModule } from '../library/library.module';
import { KastesComponent } from './kastes.component';

@NgModule({
  declarations: [
    KastesComponent],
  imports: [
    CommonModule,
    LibraryModule,
  ],
})
export class KastesModule { }
