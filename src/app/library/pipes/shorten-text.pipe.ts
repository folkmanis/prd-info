import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText'
})
export class ShortenTextPipe implements PipeTransform {

  transform(value: string, len: number = 100): string {
    return value.length > len ? value.slice(0, len - 3) + '...' : value;
  }

}
