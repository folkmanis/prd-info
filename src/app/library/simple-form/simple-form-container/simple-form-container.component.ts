import { Component, ContentChild, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { filter, last, map, shareReplay, take } from 'rxjs/operators';
import { SimpleFormSource } from '../simple-form-source';
import { SimpleFormLabelDirective } from './simple-form-label.directive';


@Component({
  selector: 'app-simple-form-container',
  templateUrl: './simple-form-container.component.html',
  styleUrls: ['./simple-form-container.component.scss']
})
export class SimpleFormContainerComponent<T> implements OnInit, OnDestroy {
  @Input() formSource: SimpleFormSource<T> | undefined;

  @Input() set data(data: T) {
    if (data) { this._data$.next(data); }
  }
  private _data$ = new Subject<T>();

  private _routerData$ = this.route.data.pipe(
    map(data => data.value as T | undefined),
    filter(value => !!value),
  );

  @Output() dataChange: Observable<T> = merge(this._data$, this._routerData$).pipe(
    shareReplay(1),
  );

  @ContentChild(SimpleFormLabelDirective)
  get label(): SimpleFormLabelDirective { return this._label; }
  set label(label: SimpleFormLabelDirective) {
    if (label) { this._label = label; }
  }
  private _label: SimpleFormLabelDirective;

  get form() { return this.formSource.form; }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  private readonly _subs = new Subscription();

  ngOnInit(): void {
    this._subs.add(
      this.dataChange.subscribe(data => this.formSource?.initValue(data, { emitEvent: false }))
    );

  }

  onResetForm(): void {
    this.dataChange.pipe(
      take(1),
    ).subscribe(data => this.formSource?.initValue(data, { emitEvent: false }));
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
    this._data$.complete();
  }

  onSave() {
    if (!this.formSource) { return; }

    const value = this.form.value;
    if (!this.formSource.isNew) {
      this.formSource.updateFn(value).pipe(
        last(),
      ).subscribe(res => this._data$.next(res));
    } else {
      this.formSource.insertFn(value).pipe(
        last(),
      ).subscribe(res => {
        this.form.markAsPristine();
        this.router.navigate(['..', res], { relativeTo: this.route });
      });
    }
  }


}
