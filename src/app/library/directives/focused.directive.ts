import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
  selector: 'input[appFocused]'
})
export class FocusedDirective implements OnInit {
  @Input('appFocused') set _focus(_f: boolean) {
    this.focused = (_f !== false);
    setTimeout(this.setFocus(this.focused), 0);
  }

  constructor(
    private el: ElementRef<HTMLInputElement>,
  ) { }
  private focused: boolean;

  ngOnInit(): void {
    setTimeout(this.setFocus(this.focused), 0);
  }

  private setFocus(foc: boolean): () => void {
    return () => {
      if (foc) {
        this.el.nativeElement.focus();
      } else {
        this.el.nativeElement.blur();
      }

    };
  }

}
