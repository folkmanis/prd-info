import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: 'input[appFocused]'
})
export class FocusedDirective implements OnInit {

  constructor(
    private el: ElementRef<HTMLInputElement>,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 0);
  }

}
