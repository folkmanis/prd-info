import { Component, OnInit } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { map, filter, distinctUntilChanged, delay, debounceTime, tap, share, startWith, single } from 'rxjs/operators';
import { merge, defer } from 'rxjs/index';
import { PartialSearchQuery } from './services/archive-search-class';

interface FormValues {
  q: string;
  tikaiZemgus: boolean;
}

@Component({
  selector: 'app-xmf-search',
  templateUrl: './xmf-search.component.html',
  styleUrls: ['./xmf-search.component.css']
})
export class XmfSearchComponent implements OnInit {

  private input: Observable<PartialSearchQuery>; // filtered value from input
  private start: Observable<PartialSearchQuery>; // initial value to start from

  searchForm = new FormGroup({
    q: new FormControl(''),
    tikaiZemgus: new FormControl(true),
  });
  searchValue$: Observable<PartialSearchQuery>;

  constructor() {
  }

  ngOnInit() {
    this.input = this.searchForm.valueChanges.pipe(
      debounceTime(300),
      filter((val: FormValues) => val.q.trim().length > 3),
      distinctUntilChanged(this.changeDetector),
      map((val) => ({
        q: val.q.trim(),
        customers: this.customers(),
      })),
    );
    this.start = defer(() => of({ q: this.searchForm.value.q, customers: this.customers() }));
    this.searchValue$ = merge(this.input, this.start);
/*     setTimeout(() => {
      this.searchForm.setValue(
        { q: 'ottens', tikaiZemgus: false },
        { emitEvent: true });
    }, 1000); // Testēšanai!!! Noņemt!!!
 */    // setTimeout(() => { this.searchControl.setValue('ottenst', { emitEvent: true }); }, 1000); // Testēšanai!!! Noņemt!!!
  }

  private customers(): string[] {
    return this.searchForm.value.tikaiZemgus ? ['Zemgus'] : null;
  }

  private changeDetector = (x: FormValues, y: FormValues): boolean => {
    for (const k of Object.keys(x)) {
      if (x[k] !== y[k]) {
        return false;
      }
    }
    return true;
  }

}
