import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'xmfFacet'
})
export class FacetPipe implements PipeTransform {

  names = [
    'Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs',
    'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris',
  ];

  transform(value: number | string, ...args: any[]): any {
    if (!value) {
      return '--';
    }
    if (+value === value && value > 0 && value <= this.names.length) {
      return value.toString().padStart(2, '0') + '-' + this.names[value - 1];
    } else {
      return value;
    }
    // return null;
  }

}
