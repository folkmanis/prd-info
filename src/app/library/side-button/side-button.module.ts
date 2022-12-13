import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
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
