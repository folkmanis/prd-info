import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDenseList]'
})
export class DenseListDirective {

  @Input('appDenseListHeight') set height(value: string | undefined) {
    this.styleHeight = value;
  }

  @HostBinding('style.height') styleHeight: string | undefined;

  constructor() { }

}
