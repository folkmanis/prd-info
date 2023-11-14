import { Directive } from '@angular/core';
import { ViewSizeBase } from './view-size-base.directive';


@Directive({
    selector: '[appViewLarge]',
    standalone: true,
})
export class ViewLargeDirective extends ViewSizeBase {

  ngOnInit(): void {
    this.setViewSize('large');
    super.ngOnInit();
  }

}
