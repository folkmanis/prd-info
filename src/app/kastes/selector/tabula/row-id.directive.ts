import { CdkScrollable } from '@angular/cdk/scrolling';
import { Directive, ElementRef, inject, input, signal } from '@angular/core';
import { AddressPackage } from '../../interfaces/address-package';

@Directive({
  selector: '[appRowId]',
  standalone: true,
  host: {
    '[class.activated]': 'activated()',
    '(animationend)': 'onAnimationEnd()',
  }
})
export class RowIdDirective {

  addressPackage = input.required<AddressPackage>({ alias: 'appRowId' });

  private element = inject(ElementRef);
  private scroller = inject(CdkScrollable);

  activated = signal(false);

  onAnimationEnd() {
    this.activated.set(false);
  }

  scrollIn() {
    this.scroller.scrollTo({
      top: this.element.nativeElement.offsetTop - (48 * 2 + 48 / 2),
      behavior: 'smooth'
    });
    this.activated.set(true);
  }

}
