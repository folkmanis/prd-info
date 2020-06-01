import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, debounceTime, map, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { PanelComponent } from 'src/app/interfaces';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnInit, PanelComponent {
  count$: Observable<number>;
  q: FormControl = new FormControl('');

  constructor() { }
  value$: Observable<string> = this.q.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    map((q: string) => q.trim()),
    distinctUntilChanged(),
    shareReplay(1),
  );

  ngOnInit(): void {
  }

}
