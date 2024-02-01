import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDenseList]',
  standalone: true,
})
export class DenseListDirective {
  @Input('appDenseListHeight')
  @HostBinding('style.height')
  height: string | undefined;
}
