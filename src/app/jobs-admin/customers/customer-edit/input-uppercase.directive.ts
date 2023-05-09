import { Directive, HostBinding } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

// https://netbasal.com/how-to-trim-the-value-of-angulars-form-control-87660941e6cb

@Directive({
  selector: 'input[appInputUppercase]',
  standalone: true,
})
export class InputUppercaseDirective {

  @HostBinding('style.text-transform') uppercase = 'uppercase';

  constructor(
    ngControl: NgControl,
  ) {
    upperCaseAccessor(ngControl.valueAccessor);
  }

}

function upperCaseAccessor(valueAccessor: ControlValueAccessor) {
  const original = valueAccessor.registerOnChange;

  valueAccessor.registerOnChange = (fn: (_: unknown) => void) => {
    return original.call(valueAccessor, (value: unknown) => {
      return fn(typeof value === 'string' ? value.toUpperCase().trim() : value);
    });
  };
}
