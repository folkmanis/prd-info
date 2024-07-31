import { booleanAttribute, Directive, effect, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDisableControl]',
  standalone: true,
})
export class DisableControlDirective {
  private ngControl = inject(NgControl, { host: true });
  appDisableControl = input(false, { transform: booleanAttribute });

  constructor() {
    effect(() => {
      if (this.appDisableControl()) {
        this.ngControl.control?.disable({ emitEvent: false });
      } else {
        this.ngControl.control?.enable({ emitEvent: false });
      }
    });
  }
}
