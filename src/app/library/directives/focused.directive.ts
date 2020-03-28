import { Directive, AfterContentChecked, ElementRef } from '@angular/core';

@Directive({
  selector: 'input[appFocused]'
})
export class FocusedDirective implements AfterContentChecked {

  constructor(
    private el: ElementRef<HTMLInputElement>,
  ) { }

  ngAfterContentChecked(): void {
    this.el.nativeElement.focus();
  }

}
