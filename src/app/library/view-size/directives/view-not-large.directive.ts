import { Directive } from '@angular/core';
import { ViewSizeBase } from './view-size-base.directive';


@Directive({
    selector: '[appViewNotLarge]',
    standalone: true,
})
export class ViewNotLargeDirective extends ViewSizeBase {

    ngOnInit(): void {
        this.setViewSize('large', true);
        super.ngOnInit();
    }

}
