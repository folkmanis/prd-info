import { AfterRenderPhase, AfterViewInit, Directive, ElementRef, afterNextRender, afterRender } from '@angular/core';

@Directive({
  selector: 'input[appFocused]',
  standalone: true,
})
export class FocusedDirective {

  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
  ) {
    afterNextRender(() => {
      this.focus();
    }, { phase: AfterRenderPhase.Write });
  }

  focus() {
    this.elementRef.nativeElement.focus();
  }


}
