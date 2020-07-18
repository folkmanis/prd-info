import { AfterViewInit, Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutService } from 'src/app/layout/layout.service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap, startWith } from 'rxjs/operators';

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
  @Input('routes') set _routes(rts: RouteSelection[]) {
    this._routes$.next(rts);
  }
  // tslint:disable-next-line: no-output-native
  @Output() select: EventEmitter<RouteSelection> = new EventEmitter();
  @Input('filter') set _setfilter(filter: string) {
    this.filterControl.setValue(filter);
  }
  @Output() filterChange = new EventEmitter<string>();

  constructor(
    private layout: LayoutService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  filterControl = new FormControl('');
  large$ = this.layout.isLarge$;

  selectionControl = new FormControl();

  private _filter$: Observable<string> = this.filterControl.valueChanges;
  private _subs: Subscription = new Subscription();
  private _routes$ = new BehaviorSubject<RouteSelection[]>([]);

  data$: Observable<RouteSelection[]> = combineLatest([
    this._routes$,
    this._filter$.pipe(startWith(''))
  ]).pipe(
    tap(([_, fltr]) => this.filterChange.next(fltr)),
    map(([data, filter]) =>
      filter.length ? data.filter(s => s.title.toUpperCase().includes(filter.toUpperCase())) : data)
  );

  ngOnInit(): void {
    this._subs.add(
      this.selectionControl.valueChanges.subscribe(rt => this.router.navigate(rt, { relativeTo: this.route }))
    );
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  onSelect(rte: RouteSelection): void {
    this.select.next(rte);
  }

}
