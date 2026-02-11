import { Directive, inject } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { assertNotNull } from '../assert-utils';

// https://netbasal.com/how-to-trim-the-value-of-angulars-form-control-87660941e6cb

@Directive({
  selector: 'input[appInputUppercase]',
  standalone: true,
  host: {
    style: 'text-transform: uppercase',
  },
})
export class InputUppercaseDirective {
  constructor() {
    const ngControl = inject(NgControl, { optional: true });
    if (ngControl?.valueAccessor) {
      upperCaseAccessor(ngControl.valueAccessor);
    }
  }
}

function upperCaseAccessor(valueAccessor: ControlValueAccessor) {
  assertNotNull(valueAccessor);

  const original = valueAccessor.registerOnChange;

  valueAccessor.registerOnChange = (fn: (_: unknown) => void) => {
    return original.call(valueAccessor, (value: unknown) => {
      return fn(typeof value === 'string' ? value.toUpperCase().trim() : value);
    });
  };
}
