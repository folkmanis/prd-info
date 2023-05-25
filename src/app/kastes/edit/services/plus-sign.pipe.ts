import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plusSign',
  standalone: true,
})
export class PlusSignPipe implements PipeTransform {

  transform(value: number): string {
    return value > 0 ? `+${value}` : value.toString();
  }

}
