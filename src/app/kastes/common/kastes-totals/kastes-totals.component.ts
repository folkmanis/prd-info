import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kastes-totals',
  templateUrl: './kastes-totals.component.html',
})
export class KastesTotalsComponent {
  totals = input<[number, number][] | null>([]);
}
