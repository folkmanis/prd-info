import { Component, Input } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApjomiTotals } from 'src/app/interfaces';

@Component({
  selector: 'app-apjomi-totals',
  templateUrl: './apjomi-totals.component.html',
  styleUrls: ['./apjomi-totals.component.css']
})
export class ApjomiTotalsComponent {
  @Input() set totals(_val: ApjomiTotals[]) {
    if (_val) {
      this.totals$.next(_val);
    }
  }

  totals$ = new ReplaySubject<ApjomiTotals[]>(1);

  totalKastes$: Observable<number> = this.totals$.pipe(
    map(kastes => kastes.reduce((acc, curr) => acc + curr.total, 0)),
  );

  constructor() { }

}
