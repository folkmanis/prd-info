import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SideButtonComponent } from './side-button.component';
import { DrawerButtonDirective } from './drawer-button.directive';
import { DrawerSmallDirective } from './drawer-small.directive';

@NgModule({
  declarations: [
    SideButtonComponent,
    DrawerButtonDirective,
    DrawerSmallDirective,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    SideButtonComponent,
    DrawerButtonDirective,
    DrawerSmallDirective,
  ]
})
export class SideButtonModule { }
