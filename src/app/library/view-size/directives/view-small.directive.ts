import { Directive, OnInit } from '@angular/core';
import { ViewSizeBase } from './view-size-base.directive';

@Directive({
  selector: '[appViewSmall]',
  standalone: true,
})
export class ViewSmallDirective extends ViewSizeBase implements OnInit {
  ngOnInit(): void {
    this.setViewSize('small');
    super.ngOnInit();
  }
}
