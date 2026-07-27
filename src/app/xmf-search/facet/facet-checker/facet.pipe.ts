import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'xmfFacet',
  standalone: true,
})
export class FacetPipe implements PipeTransform {
  names = [
    'Janvāris',
    'Februāris',
    'Marts',
    'Aprīlis',
    'Maijs',
    'Jūnijs',
    'Jūlijs',
    'Augusts',
    'Septembris',
    'Oktobris',
    'Novembris',
    'Decembris',
  ];

  transform<T extends number | string | null>(value: T): string | number {
    if (!value) {
      return '--';
    }
    if (typeof value === 'number' && value > 0 && value <= this.names.length) {
      return value.toString().padStart(2, '0') + '-' + this.names[value - 1];
    }
    return value;
  }
}
