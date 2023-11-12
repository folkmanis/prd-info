import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText',
  standalone: true,
})
export class ShortenTextPipe implements PipeTransform {
  transform(value: any, len: number = 100): any {
    if (len < 1) {
      return '';
    }

    if (typeof value === 'number') {
      return value.toString().length <= len ? value : '#'.repeat(len);
    }
    if (typeof value === 'string') {
      const sym = '.';
      const str = value.trim();
      if ((str.length === 3 && len === 3) || str.length <= len - 3) {
        return str;
      }
      if (len <= 3) {
        return sym.repeat(len);
      }
      return str.length > len ? str.slice(0, len - 3) + sym.repeat(3) : str;
    }

    return value;
  }
}
