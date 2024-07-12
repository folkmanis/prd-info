import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewSizeDirective } from './directives/view-size.directive';
import { DrawerSmallDirective } from './drawer-small.directive';
import { IfViewSizeDirective } from './directives/if-view-size.directive';
import { ViewLargeDirective } from './directives/view-large.directive';
import { ViewNotLargeDirective } from './directives/view-not-large.directive';
import { ViewSmallDirective } from './directives/view-small.directive';
import { ViewNotSmallDirective } from './directives/view-not-small.directive';

@NgModule({
  declarations: [],
  imports: [ViewSizeDirective, DrawerSmallDirective, IfViewSizeDirective, ViewLargeDirective, ViewNotLargeDirective, ViewSmallDirective, ViewNotSmallDirective, CommonModule],
  exports: [ViewSizeDirective, DrawerSmallDirective, IfViewSizeDirective, ViewLargeDirective, ViewNotLargeDirective, ViewSmallDirective, ViewNotSmallDirective],
})
export class ViewSizeModule {}
