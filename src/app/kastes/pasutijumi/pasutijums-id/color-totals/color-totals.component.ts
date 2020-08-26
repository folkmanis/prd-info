import { Component, Input } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColorTotals } from 'src/app/interfaces';


@Component({
  selector: 'app-color-totals',
  templateUrl: './color-totals.component.html',
  styleUrls: ['./color-totals.component.css']
})
export class ColorTotalsComponent {
  @Input() set totals(_val: ColorTotals[]) {
    if (_val) {
      this.totals$.next(_val);
    }
  }

  constructor() { }

  totals$ = new ReplaySubject<ColorTotals[]>(1);

  totalPakas$: Observable<number> = this.totals$.pipe(
    map(pas => pas.reduce((acc, curr) => acc + curr.total, 0)),
  );

}
