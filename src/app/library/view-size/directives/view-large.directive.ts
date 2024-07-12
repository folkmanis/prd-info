import { Directive, OnInit } from '@angular/core';
import { ViewSizeBase } from './view-size-base.directive';

@Directive({
  selector: '[appViewLarge]',
  standalone: true,
})
export class ViewLargeDirective extends ViewSizeBase implements OnInit {
  ngOnInit(): void {
    this.setViewSize('large');
    super.ngOnInit();
  }
}
