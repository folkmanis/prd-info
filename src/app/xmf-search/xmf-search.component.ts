import { Component, OnInit } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, filter, distinctUntilChanged, delay, debounceTime, tap, share, startWith } from 'rxjs/operators';
import { merge, defer } from 'rxjs/index';

@Component({
  selector: 'app-xmf-search',
  templateUrl: './xmf-search.component.html',
  styleUrls: ['./xmf-search.component.css']
})
export class XmfSearchComponent implements OnInit {

  private input: Observable<string>; // filtered value from input
  private start: Observable<string>; // initial value to start from

  searchControl = new FormControl('');
  searchValue$: Observable<string>;

  constructor() {
    this.input = this.searchControl.valueChanges.pipe(
      map((val: string) => val.trim()),
      filter((val) => val.length > 3),
      debounceTime(300),
      distinctUntilChanged(),
    );
    this.start = defer(() => of(this.searchControl.value));
    this.searchValue$ = merge(this.input, this.start );
  }

  ngOnInit() {
    setTimeout(() => { this.searchControl.setValue('12345', { emitEvent: true }); }, 1000); // Testēšanai!!! Noņemt!!!
    // setTimeout(() => { this.searchControl.setValue('ottenst', { emitEvent: true }); }, 1000); // Testēšanai!!! Noņemt!!!
  }

}
