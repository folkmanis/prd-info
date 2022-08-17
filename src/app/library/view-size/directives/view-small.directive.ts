import { Directive } from '@angular/core';
import { ViewSizeBase } from './view-size-base.directive';


@Directive({
    selector: '[appViewSmall]',
})
export class ViewSmallDirective extends ViewSizeBase {

    ngOnInit(): void {
        this.setViewSize('small');
        super.ngOnInit();
    }

}
