import { Directive } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { assertNotNull } from '../assert-utils';

@Directive({
  selector: 'input[appInputTrim]',
  standalone: true,
})
export class InputTrimDirective {
  constructor(ngControl: NgControl) {
    trimValueAccessor(ngControl.valueAccessor);
  }
}

function trimValueAccessor(valueAccessor: ControlValueAccessor | null) {
  assertNotNull(valueAccessor);
  const original = valueAccessor.registerOnChange;

  valueAccessor.registerOnChange = (fn: (_: unknown) => void) => {
    return original.call(valueAccessor, (value: unknown) => {
      return fn(typeof value === 'string' ? value.trim() : value);
    });
  };
}
