import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SideButtonComponent } from './side-button.component';

@NgModule({
  declarations: [SideButtonComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    SideButtonComponent,
  ]
})
export class SideButtonModule { }
