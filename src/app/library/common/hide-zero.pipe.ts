import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideZero',
  standalone: true,
})
export class HideZeroPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value === 0 || value === '0') {
      return '';
    }
    return value;
  }
}
