import { Directive, Input, HostBinding, ElementRef, Inject, HostListener } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Kaste } from 'src/app/interfaces';

const DELAY_TIME = 5000;

@Directive({
  selector: 'tr[appRowId]'
})
export class RowIdDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('appRowId') kaste: Kaste | undefined;

  constructor(
    private element: ElementRef<HTMLTableRowElement>,
    @Inject(CdkScrollable) private _scroller: CdkScrollable,
  ) { }

  @HostBinding('class.activated') activated = false;

  @HostListener('animationend') onAnimationEnd() {
    this.activated = false;
  }

  scrollIn() {
    this._scroller.scrollTo({
      top: this.element.nativeElement.offsetTop,
      behavior: 'smooth'
    });
    this.activated = true;
  }

}
