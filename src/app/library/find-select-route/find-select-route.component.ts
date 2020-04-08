import { AfterViewInit, Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RouteSelection {
  title: string;
  link: string | any[];
}

@Component({
  selector: 'app-find-select-route',
  templateUrl: './find-select-route.component.html',
  styleUrls: ['./find-select-route.component.css']
})
export class FindSelectRouteComponent implements OnInit, AfterViewInit, OnDestroy {
  // tslint:disable-next-line: no-input-rename
  @Input('routes') private _routes$: Observable<RouteSelection[]>;
  // tslint:disable-next-line: no-output-native
  @Output() select: EventEmitter<RouteSelection> = new EventEmitter();
  @Input('filter') set _setfilter(filter: string) {
    this._filter = filter;
    this.filterControl.setValue(filter);
  }
  @Output() filterChange = new EventEmitter<string>();

  constructor() { }

  filterControl = new FormControl('');
  data$: Observable<RouteSelection[]>;
  private _filter = '';
  private _filter$: Observable<string> = this.filterControl.valueChanges;
  private _subs: Subscription = new Subscription();

  ngOnInit(): void {
    this.data$ = combineLatest([this._routes$, this._filter$]).pipe(
      map(([data, filter]) =>
        filter.length ? data.filter(s => s.title.toUpperCase().includes(filter.toUpperCase())) : data)
    );
    this._subs.add(
      this.filterControl.valueChanges.subscribe(this.filterChange)
    );
  }

  ngAfterViewInit(): void {
    this.filterControl.setValue(this._filter);
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  onSelect(rte: RouteSelection): void {
    this.select.next(rte);
  }

}
