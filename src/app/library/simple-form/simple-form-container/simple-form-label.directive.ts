import { Directive } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';

@Directive({
  selector: '[appSimpleFormLabel]'
})
export class SimpleFormLabelDirective extends CdkPortal { }
