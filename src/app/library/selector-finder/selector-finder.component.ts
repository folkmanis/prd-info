import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject, combineLatest, merge } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RouteOrAction {
  title: string;
  link?: string | any[];
}

@Component({
  selector: 'app-selector-finder',
  templateUrl: './selector-finder.component.html',
  styleUrls: ['./selector-finder.component.css']
})
export class SelectorFinderComponent implements OnInit {
  @Input('actions') private _actions$: Observable<string[]>;
  @Input('routes') set private(routes: Observable<{ title: string, link: string | any[]; }[]>) {
    this._routes$ = routes;
    this.navigation = true;
  }
  @Output('selection') selected: EventEmitter<string> = new EventEmitter();

  @Input('filter') set _filter(filter: string) {
    this.filterControl.setValue(filter);
  }
  constructor() { }

  navigation = false;
  filterControl = new FormControl('');
  data$: Observable<RouteOrAction[]>;
  private _routes$: Observable<{ title: string, link: string | any[]; }[]>;

  ngOnInit(): void {
    const routesOrActions$ = merge(
      this._actions$.pipe(map(act => act.map(a => ({ title: a })))),
      this._routes$
    );

    this.data$ = combineLatest([routesOrActions$, this.filterControl.valueChanges])
      .pipe(
        map(([data, filter]: [RouteOrAction[], string]) =>
          data.filter(s => s.title.toUpperCase().includes(filter.toUpperCase())))
      );

  }

}
