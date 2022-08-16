import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewSizeDirective } from './view-size.directive';
import { DrawerSmallDirective } from './drawer-small.directive';



@NgModule({
  declarations: [
    ViewSizeDirective,
    DrawerSmallDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ViewSizeDirective,
    DrawerSmallDirective,
  ]
})
export class ViewSizeModule { }
