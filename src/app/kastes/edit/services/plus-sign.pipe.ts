import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plusSign'
})
export class PlusSignPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    return value > 0 ? `+${value}` : value.toString();
  }

}
