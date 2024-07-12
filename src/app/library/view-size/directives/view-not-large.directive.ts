import { Directive, OnInit } from '@angular/core';
import { ViewSizeBase } from './view-size-base.directive';

@Directive({
  selector: '[appViewNotLarge]',
  standalone: true,
})
export class ViewNotLargeDirective extends ViewSizeBase implements OnInit {
  ngOnInit(): void {
    this.setViewSize('large', true);
    super.ngOnInit();
  }
}
