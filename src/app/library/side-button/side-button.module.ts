import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SideButtonComponent } from './side-button.component';
import { DrawerButtonDirective } from './drawer-button.directive';

@NgModule({
  declarations: [
    SideButtonComponent,
    DrawerButtonDirective,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    DrawerButtonDirective,
  ]
})
export class SideButtonModule { }
