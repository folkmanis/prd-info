import { Directive } from '@angular/core';
import { ViewSizeBase } from './view-size-base.directive';


@Directive({
    selector: '[appViewNotSmall]',
})
export class ViewNotSmallDirective extends ViewSizeBase {

    ngOnInit(): void {
        this.setViewSize('small', true);
        super.ngOnInit();
    }

}
