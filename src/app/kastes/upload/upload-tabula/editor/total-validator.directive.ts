import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Box } from '../../adrese-box';
import { Totals } from '../../adrese-box';

@Directive({
  selector: '[appTotalValidator]'
})
export class TotalValidatorDirective {

  static max = 5;
  constructor() { }

  static totalValidator(colTotals: Totals): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const result: ValidationErrors = {};
      let newColTotals: Box;
      let newRowTotals: number[];
      let err = false;
      ({ col: newColTotals, row: newRowTotals } = TotalValidatorDirective.calcTotals(control.value));
      for (const k of Object.keys(newColTotals)) {
        if (newColTotals[k] !== colTotals[k]) {
          err = true;
          result[k] = newColTotals[k] - colTotals[k];
        }
      }
      for (const k of Object.keys(newRowTotals)) {
        if (newRowTotals[k] > TotalValidatorDirective.max) {
          err = true;
          result[k] = newRowTotals[k] - TotalValidatorDirective.max;
        }
      }
      if (err) {
        return result;
      } else {
        return null;
      }
    };
  }

  static calcTotals(val: Box[]): { row: number[], col: Box } {
    const colSums = new Box();
    const rowSums: number[] = [];
    for (const rKey of Object.keys(val)) {
      rowSums[rKey] = 0;
      for (const cKey of Object.keys(val[rKey])) {
        rowSums[rKey] += val[rKey][cKey];
        if (!colSums[cKey]) { colSums[cKey] = 0; }
        colSums[cKey] += val[rKey][cKey];
      }
    }
    return { row: rowSums, col: colSums };
  }

}
