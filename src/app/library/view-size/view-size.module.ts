import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewSizeDirective } from './view-size.directive';
import { DrawerSmallDirective } from './drawer-small.directive';
import { IfViewSizeDirective } from './if-view-size.directive';



@NgModule({
  declarations: [
    ViewSizeDirective,
    DrawerSmallDirective,
    IfViewSizeDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ViewSizeDirective,
    DrawerSmallDirective,
    IfViewSizeDirective,
  ]
})
export class ViewSizeModule { }
