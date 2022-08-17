import { Directive, Input, TemplateRef } from '@angular/core';
import { ViewSizeBase } from './view-size-base.directive';
import { AppBreakpoints } from '../layout.service';

@Directive({
  selector: '[appIfViewSize]',
})
export class IfViewSizeDirective extends ViewSizeBase {

  @Input('appIfViewSize') set viewSize(value: AppBreakpoints) {
    this.setViewSize(value);
  }

  @Input('appIfViewSizeElse') set elseTemplate(value: TemplateRef<any> | null) {
    this.setElseTemplate(value);
  }


}
