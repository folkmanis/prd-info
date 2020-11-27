import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'input[appFocused]'
})
export class FocusedDirective implements AfterViewInit {

  constructor(
    private el: ElementRef<HTMLInputElement>,
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.el.nativeElement.focus(), 0);
  }

}
