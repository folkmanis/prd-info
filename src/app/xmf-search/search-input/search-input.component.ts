import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {

  @Input() count: number | undefined | null;

  q = new FormControl('');

  @Output() searchString = this.q.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    map(q => q.trim()),
    distinctUntilChanged(),
    shareReplay(1),
  );


}
