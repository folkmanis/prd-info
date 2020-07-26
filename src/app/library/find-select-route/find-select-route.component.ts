import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout/layout.service';

export interface RouteSelection {
  title: string;
  link: string | any[];
}

@Component({
  selector: 'app-find-select-route',
  templateUrl: './find-select-route.component.html',
  styleUrls: ['./find-select-route.component.css']
})
export class FindSelectRouteComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line: no-input-rename
  @Input('routes') set _routes(rts: RouteSelection[]) {
    this._routes$.next(rts);
  }
  // tslint:disable-next-line: no-output-native
  @Output() select: EventEmitter<RouteSelection> = new EventEmitter();
  @Input('filter') set _setfilter(fltr: string) {
    this.filterControl.setValue(fltr);
  }
  @Output() filterChange = new EventEmitter<string>();

  @Input() set selected(_sel: RouteSelection) {
    this.selectionControl.setValue(_sel.link, { emitEvent: false });
  }
  get selected(): RouteSelection {
    return this._routes$.value.find(rte => rte.link === this.selectionControl.value);
  }

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
    map(([data, fltr]) =>
      fltr.length ? data.filter(s => s.title.toUpperCase().includes(fltr.toUpperCase())) : data)
  );

  ngOnInit(): void {
    this._subs.add(
      this.selectionControl.valueChanges.subscribe(rt => this.router.navigate(rt, { relativeTo: this.route }))
    );
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
    this.filterChange.complete();
    this.select.complete();
  }

  onSelect(rte: RouteSelection): void {
    this.select.next(rte);
  }

}
