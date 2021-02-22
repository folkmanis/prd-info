import { Component, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';
import { ArchiveSearchService } from '../services/archive-search.service';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent  {
  @Input() set count(param: number) {
    this._count = param;
  }
  get count(): number { return this._count; }

  q: FormControl = new FormControl('');
  private _count = 0;

  @Output() searchString = this.q.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    map((q: string) => q.trim()),
    distinctUntilChanged(),
    shareReplay(1),
  );

  busy$ = this.service.busy$;

  constructor(
    private service: ArchiveSearchService,
  ) { }

}
