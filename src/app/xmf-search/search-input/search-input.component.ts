import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, shareReplay, merge, of } from 'rxjs';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {

  searchControl = new FormControl('');

  @Output() searchString = merge(
    // of(''),
    this.searchControl.valueChanges
  ).pipe(
    debounceTime(300),
    map(q => q.trim()),
    distinctUntilChanged(),
    // shareReplay(1),
  );


}
