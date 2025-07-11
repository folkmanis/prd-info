import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

@Directive({
  selector: 'input[appFocused]',
  standalone: true,
})
export class FocusedDirective {
  private elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

  constructor() {
    afterNextRender({
      write: () => {
        this.focus();
      },
    });
  }

  focus() {
    this.elementRef.nativeElement.focus();
  }
}
