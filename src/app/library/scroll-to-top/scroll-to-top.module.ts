import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollToTopComponent } from './scroll-to-top.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScrollTopDirective } from './scroll-top.directive';

@NgModule({
  declarations: [
    ScrollToTopComponent,
    ScrollTopDirective,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    ScrollToTopComponent,
    ScrollTopDirective,
  ]
})
export class ScrollToTopModule { }
