import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, debounceTime, map, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { PanelComponent } from 'src/app/interfaces';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css'],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  private _count = 0;
  @Input() set count(param: number) {
    this._count = param;
  }
  get count(): number { return this._count; }

  @Output() searchString = new EventEmitter<string>();

  q: FormControl = new FormControl('');
  _subs = new Subscription();

  value$: Observable<string> = this.q.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    map((q: string) => q.trim()),
    distinctUntilChanged(),
    shareReplay(1),
  );

  constructor() { }

  ngOnInit(): void {
    this._subs.add(
      this.value$.subscribe(this.searchString)
    );
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

}
