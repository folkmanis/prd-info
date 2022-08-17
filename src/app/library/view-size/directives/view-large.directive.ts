import { Directive } from '@angular/core';
import { ViewSizeBase } from './view-size-base.directive';


@Directive({
  selector: '[appViewLarge]',
})
export class ViewLargeDirective extends ViewSizeBase {

  ngOnInit(): void {
    this.setViewSize('large');
    super.ngOnInit();
  }

}
