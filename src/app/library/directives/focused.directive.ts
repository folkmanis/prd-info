import { AfterViewInit, Directive, ElementRef, afterNextRender, afterRender } from '@angular/core';

@Directive({
  selector: 'input[appFocused]',
  standalone: true,
})
export class FocusedDirective {

  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
  ) {
    afterNextRender({ write: () => {
        this.focus();
    } }, );
  }

  focus() {
    this.elementRef.nativeElement.focus();
  }


}
