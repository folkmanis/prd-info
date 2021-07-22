import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'input[appFocused]'
})
export class FocusedDirective implements AfterViewInit {

  constructor(
    private el: ElementRef<HTMLInputElement>,
  ) { }

  focus() {
    this.el.nativeElement.focus();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.focus(), 0);
  }


}
