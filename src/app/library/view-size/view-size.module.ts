import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsLargeDirective } from './is-large.directive';
import { ViewSizeDirective } from './view-size.directive';
import { DrawerSmallDirective } from './drawer-small.directive';



@NgModule({
  declarations: [
    IsLargeDirective,
    ViewSizeDirective,
    DrawerSmallDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IsLargeDirective,
    ViewSizeDirective,
    DrawerSmallDirective,
  ]
})
export class ViewSizeModule { }
