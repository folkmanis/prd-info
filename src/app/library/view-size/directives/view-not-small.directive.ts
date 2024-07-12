import { Directive, OnInit } from '@angular/core';
import { ViewSizeBase } from './view-size-base.directive';

@Directive({
  selector: '[appViewNotSmall]',
  standalone: true,
})
export class ViewNotSmallDirective extends ViewSizeBase implements OnInit {
  ngOnInit(): void {
    this.setViewSize('small', true);
    super.ngOnInit();
  }
}
