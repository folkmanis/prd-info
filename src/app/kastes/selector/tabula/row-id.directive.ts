import { CdkScrollable } from '@angular/cdk/scrolling';
import { Directive, ElementRef, HostBinding, HostListener, Input, inject } from '@angular/core';
import { AddressPackage } from '../../interfaces/address-package';

@Directive({
  selector: '[appRowId]',
  standalone: true
})
export class RowIdDirective {

  @Input({ alias: 'appRowId', required: true }) addressPackage!: AddressPackage;

  private element = inject(ElementRef);
  private scroller = inject(CdkScrollable);

  @HostBinding('class.activated') activated = false;

  @HostListener('animationend') onAnimationEnd() {
    this.activated = false;
  }

  scrollIn() {
    this.scroller.scrollTo({
      top: this.element.nativeElement.offsetTop - (48 * 2 + 48 / 2),
      behavior: 'smooth'
    });
    this.activated = true;
  }

}
