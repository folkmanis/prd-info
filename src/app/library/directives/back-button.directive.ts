import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';

/** Adds location.back() to button */
@Directive({
  selector: 'button[appBackButton]'
})
export class BackButtonDirective {

  constructor(
    private location: Location,
  ) { }

  @HostListener('click') onClick() {
    this.location.back();
  }

}
